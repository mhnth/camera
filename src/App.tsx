import React, { useRef, useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Khi component được mount, chúng ta mở camera và vẽ hình ảnh từ camera lên canvas
  React.useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      // Clean up code
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, []);

  // Xử lý sự kiện khi nhấn nút chụp ảnh
  const handleCaptureAndCrop = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.imageSmoothingEnabled = false;

        const { videoWidth, videoHeight } = videoRef.current;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

        // Cắt ảnh thành phần cụ thể
        const startY = videoHeight * 0.1; // Tọa độ y bắt đầu cắt
        const width = videoHeight * 0.55; // Chiều rộng phần cắt
        const height = videoHeight * 0.55; // Chiều cao phần cắt

        const scaledWidth = 200; // Kích thước ảnh đã chụp
        const scaledHeight = 200;

        // Tọa độ chính giữa của màn hình
        const centerX = videoWidth / 2;
        // Tọa độ bắt đầu của phần cắt
        const startX = centerX - width / 2;
        // const startY = centerY - height / 2;

        // Xóa nội dung của canvas trước khi vẽ ảnh mới
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        context.drawImage(
          videoRef.current,
          startX,
          startY,
          width,
          height,
          0,
          0,
          // 0,
          // 0
          scaledWidth,
          scaledHeight
        );

        // Lấy dữ liệu ảnh từ canvas
        // const imageData = context.getImageData(startX, startY, width, height);
        const imageData = context.getImageData(0, 0, scaledWidth, scaledHeight);

        console.log(imageData);

        // Tạo một canvas mới với kích thước phù hợp với phần được cắt
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = scaledWidth;
        croppedCanvas.height = scaledHeight;
        const croppedContext = croppedCanvas.getContext('2d');

        // Chuyển dữ liệu ảnh sang định dạng base64 để hiển thị
        // const croppedImage = canvasRef.current.toDataURL();
        // setCapturedImage(croppedImage);

        // Vẽ lại ảnh từ imageData lên canvas mới
        if (croppedContext) {
          croppedContext.putImageData(imageData, 0, 0);

          // Lưu ảnh đã cắt từ canvas vào state để hiển thị
          setCapturedImage(croppedCanvas.toDataURL());
        }
      }
    }
  };

  return (
    <>
      <div className="cam-holder">
        <div className="vid-holder">
          {/* Hiển thị video từ camera */}
          <video
            className="vid"
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ maxWidth: '100%' }}
          ></video>
        </div>
        <img
          className="faceMask"
          src="https://cdn.discordapp.com/attachments/1092261465236443189/1212247596748242955/faceMask.png?ex=65f1248d&is=65deaf8d&hm=3d89fb8dd99b229a4de604b022c5a1a0cb9334ea2ded7f26b3aa446b172efade&"
          alt=""
        />
        <div>
          {/* Canvas để vẽ hình ảnh từ camera */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
        <div className="captureBox">
          <div onClick={handleCaptureAndCrop} className="circleOuter">
            <div className="circle"></div>
          </div>
          <div className="captureText">
            Positionieren Sie Gesicht und Augenpartie und machen Sie ein Foto
          </div>
          <div className="closeBtn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28"
              viewBox="0 -960 960 960"
              width="28"
              fill="#fff"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </div>
        </div>
      </div>
      <div>{capturedImage && <img src={capturedImage} alt="Captured" />}</div>
    </>
  );
};

export default App;

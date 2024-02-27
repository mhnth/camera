import './App.css';

import React, { useEffect, useRef, useState } from 'react';

const FaceDetectionComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const virtualCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [cutImage, setCutImage] = useState<string | null>(null);

  let requestID1 = 0;
  let requestID2 = 0;

  useEffect(() => {
    let stream: MediaStream | null = null; // Xác định kiểu dữ liệu của stream

    const startCamera = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (streamObj: MediaStream) {
          // Xác định kiểu dữ liệu của streamObj
          stream = streamObj; // Gán streamObj cho biến stream
          videoRef!.current!.srcObject = stream;
          console.log('Camera started');
        })
        .catch(function (err) {
          console.error('Error accessing the camera:', err);
        });
    };

    const stopCamera = () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        console.log('Camera stopped');
      }

      cancelAnimationFrame(requestID1);
      cancelAnimationFrame(requestID2);
    };

    if (
      isCameraOn &&
      videoRef.current &&
      canvasRef.current &&
      virtualCanvasRef.current
    ) {
      startCamera();
      const video = videoRef.current;
      const virtualCanvas = virtualCanvasRef.current;
      const canvas = canvasRef.current;
      const virtualContext = virtualCanvas!.getContext('2d');
      const context = canvas!.getContext('2d');

      const cutImageIntoEllipseVirtual = () => {
        if (!video.paused && !video.ended && virtualContext) {
          // Clear the canvas
          virtualContext.clearRect(
            0,
            0,
            virtualCanvas.width,
            virtualCanvas.height
          );

          // virtualContext.translate(virtualCanvas.width, 0);
          // virtualContext.scale(-1, 1);

          // Draw the video frame on the canvas

          // maybe we don't need this
          // virtualContext.drawImage(
          //   video,
          //   0,
          //   0,
          //   virtualCanvas.width,
          //   virtualCanvas.height
          // );

          // Create a background rectangle with a solid color
          virtualContext.fillStyle = 'rgba(255, 255, 255, 0)'; // You can change the color here
          virtualContext.fillStyle = 'rgba(2, 35, 86, 1)'; // You can change the color here
          virtualContext.fillRect(
            0,
            0,
            virtualCanvas.width,
            virtualCanvas.height
          );

          // Create an elliptical path (vertical ellipse)
          virtualContext.beginPath();
          virtualContext.ellipse(
            virtualCanvas.width / 2, // X coordinate of the center
            virtualCanvas.height / 2, // Y coordinate of the center
            virtualCanvas.width / 4, // Horizontal radius
            virtualCanvas.height / 3.5, // Vertical radius (adjust as needed)
            0, // Rotation angle (0 for vertical)
            0, // Start angle
            Math.PI * 2 // End angle
          );
          virtualContext.closePath();

          virtualContext.strokeStyle = 'white';
          virtualContext.lineWidth = 4; // Increase the line width as needed

          virtualContext.setLineDash([10, 5]); // [dashLength, spaceLength]

          virtualContext.stroke();

          virtualContext.clip();

          virtualContext.drawImage(
            video,
            0,
            0,
            virtualCanvas.width,
            virtualCanvas.height
          );
        }

        return requestAnimationFrame(cutImageIntoEllipseVirtual);
      };

      const cutImageIntoEllipse = () => {
        if (!video.paused && !video.ended && context) {
          // Clear the canvas

          // maybe we dont need it
          // context.clearRect(0, 0, canvas.width, canvas.height);

          // Set globalCompositeOperation to 'destination-out'
          context.globalCompositeOperation = 'destination-out';

          // Draw the video frame on the canvas
          // context.drawImage(video, 0, 0, canvas.width, canvas.height);

          context.globalCompositeOperation = 'source-over';

          // Create a background rectangle with a solid color
          context.fillStyle = 'rgba(255, 255, 255, 0)'; // You can change the color here

          // maybe we dont need it
          // context.fillRect(0, 0, canvas.width, canvas.height);

          // Create an elliptical path (vertical ellipse)
          context.beginPath();
          context.ellipse(
            canvas.width / 2, // X coordinate of the center
            canvas.height / 2, // Y coordinate of the center
            canvas.width / 4, // Horizontal radius
            canvas.height / 2.95, // Vertical radius (adjust as needed)
            0, // Rotation angle (0 for vertical)
            0, // Start angle
            Math.PI * 2 // End angle
          );
          context.closePath();

          // Set the stroke style to white and increase the line width
          context.strokeStyle = 'white';
          context.lineWidth = 0.5; // Increase the line width as needed

          // Set the line dash style
          context.setLineDash([10, 5]); // [dashLength, spaceLength]

          // Draw the stroke (border) of the ellipse
          context.stroke();

          // Clip the canvas to the elliptical path
          context.clip();

          // Redraw the video frame, clipped to the elliptical path
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // context.globalCompositeOperation = 'source-over';
        }

        // Call recursively to keep updating the frame
        return requestAnimationFrame(cutImageIntoEllipse);
      };

      requestID1 = cutImageIntoEllipse();
      requestID2 = cutImageIntoEllipseVirtual();
    } else {
      stopCamera();
    }

    // Clean-up function
    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const cutAndDisplayImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png'); // Get the base64 encoded data URL of the canvas content
      setCutImage(dataUrl);
    }
  };

  // const exportImage = () => {
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const link = document.createElement('a');
  //     link.download = 'ellipse_image.png';
  //     link.href = canvas.toDataURL('image/png');
  //     link.click();
  //   }
  // };

  return (
    <div>
      <div className="header">
        {/* <button onClick={toggleCamera}>
          {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button> */}
        {/* <button onClick={exportImage}>Export Image</button> */}
      </div>

      <video
        ref={videoRef}
        style={{ display: isCameraOn ? 'none' : 'none' }}
        autoPlay
      ></video>
      <div className="captureContainer">
        <canvas
          ref={virtualCanvasRef}
          width={480}
          height={600}
          style={{
            display: isCameraOn ? 'block' : 'none',
          }}
          className="canvas1"
        ></canvas>
        <canvas
          ref={canvasRef}
          width={480}
          height={600}
          style={{
            display: isCameraOn ? 'none' : 'none',
          }}
          className="canvas1"
        ></canvas>
        <div className="captureBox">
          <div onClick={cutAndDisplayImage} className="circle-outer">
            <div className="circle"></div>
          </div>
          <div className="captureText">
            Positionieren Sie Gesicht und Augenpartie und machen Sie ein Foto
          </div>
          <div onClick={toggleCamera} className="closeBtn">
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
        <div className="imgBox">
          {cutImage && <img width={'100vw'} src={cutImage} alt="Cut Image" />}
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionComponent;

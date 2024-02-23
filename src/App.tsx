import './App.css';

import React, { useEffect, useRef, useState } from 'react';

const FaceDetectionComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [cutImage, setCutImage] = useState<string | null>(null);

  useEffect(() => {
    if (isCameraOn && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err) {
          console.error('Error accessing the camera:', err);
        });

      const cutImageIntoEllipse = () => {
        if (!video.paused && !video.ended && context) {
          // Clear the canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the video frame on the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Create an elliptical path (vertical ellipse)
          context.beginPath();
          context.ellipse(
            canvas.width / 2, // X coordinate of the center
            canvas.height / 2, // Y coordinate of the center
            canvas.width / 4, // Horizontal radius
            canvas.height / 2.5, // Vertical radius (adjust as needed)
            0, // Rotation angle (0 for vertical)
            0, // Start angle
            Math.PI * 2 // End angle
          );
          context.closePath();

          // Set the stroke style to white and increase the line width
          context.strokeStyle = 'white';
          context.lineWidth = 8; // Increase the line width as needed

          // Set the line dash style
          context.setLineDash([10, 5]); // [dashLength, spaceLength]

          // Draw the stroke (border) of the ellipse
          context.stroke();

          // Clip the canvas to the elliptical path
          context.clip();

          // Redraw the video frame, clipped to the elliptical path
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Change global composite mode to 'destination-in'
          // This will only draw the new shapes where the existing canvas content exists
          context.globalCompositeOperation = 'destination-in';
          context.beginPath();
          context.rect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'white'; // Color doesn't matter here
          context.fill();

          // Reset global composite mode
          context.globalCompositeOperation = 'source-over';
        }

        // Call recursively to keep updating the frame
        requestAnimationFrame(cutImageIntoEllipse);
      };

      cutImageIntoEllipse();
    }
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

  const exportImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = 'ellipse_image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div>
      <h1>Face Detection with OpenC</h1>
      <video
        ref={videoRef}
        width={300}
        height={800}
        style={{ display: isCameraOn ? 'none' : 'none' }}
        autoPlay
      ></video>
      <canvas
        ref={canvasRef}
        width={480}
        height={600}
        style={{
          display: isCameraOn ? 'block' : 'none',
          backgroundColor: 'transparent',
        }}
      ></canvas>
      <button onClick={toggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <button onClick={cutAndDisplayImage}>Cut and Display Image</button>
      <button onClick={exportImage}>Export Image</button>
      {cutImage && <img src={cutImage} alt="Cut Image" />}
    </div>
  );
};

export default FaceDetectionComponent;
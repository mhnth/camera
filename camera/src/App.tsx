import './App.css';

import React, { useEffect, useRef, useState } from 'react';

const FaceDetectionComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

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

          // Create a circular path
          // context.beginPath();
          // context.arc(
          //   canvas.width / 2,
          //   canvas.height / 2,
          //   canvas.width / 2,
          //   0,
          //   Math.PI * 2
          // );
          // context.closePath();

          // // Clip the canvas to the circular path
          // context.clip();

          // // Redraw the video frame, clipped to the circular path
          // context.drawImage(video, 0, 0, canvas.width, canvas.height);

          context.beginPath();
          context.ellipse(
            canvas.width / 2, // X coordinate of the center
            canvas.height / 2, // Y coordinate of the center
            canvas.width / 4, // Horizontal radius
            canvas.height / 2, // Vertical radius (adjust as needed)
            0, // Rotation angle (0 for vertical)
            0, // Start angle
            Math.PI * 2 // End angle
          );
          context.closePath();

          // Clip the canvas to the elliptical path
          context.clip();

          // Redraw the video frame, clipped to the elliptical path
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
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

  return (
    <div>
      <h1>Face Detection with OpenC</h1>
      <video
        ref={videoRef}
        width={640}
        height={480}
        style={{ display: isCameraOn ? 'block' : 'none' }}
        autoPlay
      ></video>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: isCameraOn ? 'block' : 'none' }}
      ></canvas>
      <button onClick={toggleCamera}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
    </div>
  );
};

export default FaceDetectionComponent;

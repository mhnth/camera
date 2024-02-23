import './App.css';

import * as faceapi from 'face-api.js';

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

      const detectFaces = () => {
        if (video.paused || video.ended) return false;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Perform face detection using OpenCV.js here...

        requestAnimationFrame(detectFaces);
      };

      detectFaces();
    }
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  return (
    <div>
      <h1>Face Detection with OpenCV.js</h1>
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

// const App: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const loadModels = async () => {
//       // Load face-api.js models
//       await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//       await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//       await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//       await faceapi.nets.tinyYolov2.loadFromUri('/models');
//     };

//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error('Error accessing camera:', error);
//       }
//     };

//     const detectFace = async () => {
//       if (videoRef.current && canvasRef.current) {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;

//         const displaySize = { width: video.width, height: video.height };
//         faceapi.matchDimensions(canvas, displaySize);

//         setInterval(async () => {
//           const detections = await faceapi
//             .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()
//             .withFaceDescriptors()
//             .withFaceExpressions()
//             .withAgeAndGender();

//           const resizedDetections = faceapi.resizeResults(
//             detections,
//             displaySize
//           );
//           canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
//           faceapi.draw.drawDetections(canvas, resizedDetections);
//           faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//           faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//           resizedDetections.forEach((result) => {
//             const { age, gender, genderProbability } = result;
//             new faceapi.draw.DrawTextField(
//               [
//                 `${faceapi.utils.round(age, 0)} years`,
//                 `${gender} (${faceapi.utils.round(genderProbability)})`,
//               ],
//               result.detection.box.bottomLeft
//             ).draw(canvas);
//           });
//         }, 100);
//       }
//     };

//     loadModels();
//     startCamera();
//     detectFace();
//   }, []);

//   return (
//     <div>
//       <h1>Face Detection App</h1>
//       <video ref={videoRef} autoPlay playsInline />
//       <canvas ref={canvasRef} />
//     </div>
//   );
// };

// export default App;

// const App: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }

//         const faceDetection = () => {
//           if (videoRef.current) {
//             const video = videoRef.current;
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');

//             video.addEventListener('loadedmetadata', () => {
//               canvas.width = video.videoWidth;
//               canvas.height = video.videoHeight;
//             });

//             if (context) {
//               canvas.width = video.videoWidth;
//               canvas.height = video.videoHeight;
//               context.drawImage(video, 0, 0, canvas.width, canvas.height);

//               // Now you can process the image data in the canvas to detect faces using your own algorithm
//               // Example: draw a rectangle around the detected face
//               context.strokeStyle = 'red';
//               context.lineWidth = 2;
//               context.beginPath();
//               context.rect(50, 50, 100, 100); // Example coordinates for the detected face
//               context.stroke();
//             }

//             requestAnimationFrame(faceDetection);
//           }
//         };

//         faceDetection();
//       } catch (error) {
//         console.error('Error accessing camera:', error);
//       }
//     };

//     startCamera();
//   }, []);

//   return (
//     <div>
//       <h1>Face Detection App</h1>
//       <video ref={videoRef} autoPlay playsInline />
//     </div>
//   );
// };

// export default App;

const App1: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Không thể truy cập vào camera:', err);
    }
  };

  return (
    <div>
      <h1>Camera App</h1>
      <button onClick={startCamera}>Mở camera</button>
      <div>
        <video ref={videoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

// export  App1;

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   );
// }

// export default App;

import React, { useEffect, useRef, useState } from "react";
import "@mediapipe/face_mesh";
import "./App.css";

const FaceMeshApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [useCamera, setUseCamera] = useState(false); // Toggle between camera & upload mode
  const [faceMesh, setFaceMesh] = useState(null); // Store FaceMesh instance

  useEffect(() => {
    import("@mediapipe/face_mesh").then((mpFaceMesh) => {
      const newFaceMesh = new mpFaceMesh.FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${mpFaceMesh.VERSION}/${file}`,
      });

      newFaceMesh.setOptions({
        selfieMode: false,
        enableFaceGeometry: false,
        maxNumFaces: 1,
        refineLandmarks: true, // More accurate landmarks
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      setFaceMesh(newFaceMesh);

      newFaceMesh.onResults((results) => {
        document.querySelector(".input_video").addEventListener("loadeddata", adjustCanvasSize);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        if (results.multiFaceLandmarks) {
          results.multiFaceLandmarks.forEach((landmarks) => {
            drawLandmarks(ctx, landmarks);
          });
        }
      });

      if (useCamera) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }

            const processVideo = async () => {
              if (videoRef.current) {
                await newFaceMesh.send({ image: videoRef.current });
              }
              requestAnimationFrame(processVideo);
            };

            processVideo();
          })
          .catch((error) => {
            console.error("Error accessing webcam:", error);
            alert("Could not access webcam. Please check camera permissions.");
          });
      }
    });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [useCamera]); // Re-run when useCamera state changes

  // Handle image upload and send to FaceMesh
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    resetWebsiteData();
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
  
        // Set canvas dimensions based on image aspect ratio
        const maxWidth = 650;
        const maxHeight = 500;
        let width = img.width;
        let height = img.height;
  
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
  
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
  
        // Clear previous content and draw new image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
  
        if (!faceMesh) {
          console.error("FaceMesh not initialized yet!");
          return;
        }
  
        try {
          // Create a temporary canvas for processing
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(img, 0, 0, width, height);
          
          // Process the image with FaceMesh
          await faceMesh.send({ image: tempCanvas });
        } catch (error) {
          console.error("Error processing image with FaceMesh:", error);
        }
      };
    };
  
    reader.readAsDataURL(file);
  };
  
  // Update resetWebsiteData function
  const resetWebsiteData = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 650;  // Match with CSS max-width
      canvas.height = 500; // Match with CSS height
    }
  
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  
  const adjustCanvasSize = () => {
    const video = document.querySelector(".input_video");
    const canvas = document.querySelector(".output_canvas");

    if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }
};

  return (
    <div>
      <button
        onClick={() => {
          setUseCamera(!useCamera);

          // Clear the canvas when switching modes
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }}
        className="toggle-btn"
      >
        {useCamera ? "Switch to Upload Image" : "Switch to Camera"}
      </button>

      <div className="container">
        {useCamera ? (
          <div className="input_video">
            <video ref={videoRef} autoPlay muted></video>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="upload-input"
          />

        )}
    &nbsp;
    &nbsp;
        <div>
          <canvas className="output_canvas" ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  );
};

const drawLandmarks = (ctx, landmarks) => {
  if (!ctx || !landmarks) return;

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  const drawConnectors = (indices, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();

    indices.forEach((index, i) => {
      const x = landmarks[index].x * canvasWidth;
      const y = landmarks[index].y * canvasHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  // Define facial feature connections
  const FACEMESH_RIGHT_EYE = [33, 160, 158, 133, 153, 144, 33];
  const FACEMESH_LEFT_EYE = [263, 373, 380, 362, 385, 387, 263];
  const FACEMESH_LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 61];

  drawConnectors(FACEMESH_RIGHT_EYE, "blue");
  drawConnectors(FACEMESH_LEFT_EYE, "blue");
  drawConnectors(FACEMESH_LIPS, "red");

  // Draw individual landmark points
  landmarks.forEach((landmark) => {
    const x = landmark.x * canvasWidth;
    const y = landmark.y * canvasHeight;

    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
  });
};


export default FaceMeshApp;
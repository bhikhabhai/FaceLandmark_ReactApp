# **FaceMesh React App**

A React application that leverages MediaPipe Face Mesh for real-time
facial landmark detection. The app lets users either use their webcam or
upload an image to detect and render facial landmarks on a canvas.

# Features

• **Dual Modes**: Toggle between webcam (real-time detection) and image upload modes.

• **Real-Time Detection**: Uses MediaPipe's FaceMesh to accurately detect facial landmarks.

• **Custom Rendering**: Draws facial features (eyes and lips) and individual landmark points on a canvas.

• **Responsive Canvas**: Automatically adjusts the canvas size based on input dimensions.

• **GitHub Pages Deployment**: Ready for easy deployment on GitHub Pages.

# Demo

Live Demo : (https://bhikhabhai.github.io/FaceLandmark_ReactApp/)

# Getting Started
# Prerequisites

• Node.js (v12 or higher) 

• npm (comes with Node.js)

# Installation

1. Clone the repository:

        git clone https://github.com/bhikhabhai/FaceLandmark_ReactApp.git

        cd facemesh-react-app

2. Install dependencies:

        npm install
   
        npm install @mediapipe/face_mesh device-detector-js

# Running Locally

Start the development server:

    npm start

Then open your browser and navigate to locel server. 
# Building for Production

Create an optimized production build:

    npm run build

This command will generate a build folder containing the production-ready files. 

# Deploying on GitHub Pages

This project uses a GitHub Actions workflow to automate deployments to GitHub Pages on every push to the main branch.

1. Create a Workflow File:

    Create .github/workflows/deploy.yml with the Mention content in repo.
2. Notes:

    • Build Output Directory: If your build output is not ./dist (e.g., ./build), update the paths accordingly in both the upload and deploy steps.
    • Automatic Deployment: Pushing to the main branch triggers the workflow to build and deploy your app automatically.

After committing and pushing this file, your site will be live at https://your-username.github.io/repository-name.
# Code Structure

• **src/App.js**: Contains the main React component, handling both the webcam and image upload modes along with the FaceMesh processing. 

• **src/App.css**: Provides basic styling for the application. 

• **public/index.html**: The entry point HTML file for the React app.

# Usage

• **Camera Mode**: Click the "Switch to Camera" button to start real-time
facial detection using your webcam. Make sure to allow camera access
when prompted.

• **Image Upload Mode**: Click the "Switch to Upload Image" button, then
choose an image file from your computer. The app will process the image
and display facial landmarks on the canvas.

# Technologies Used

• **React**: For building the user interface. 

• **MediaPipe Face Mesh**: For facial landmark detection. 

• **gh-pages**: For deploying the React app on GitHub Pages. 

• **JavaScript & CSS**: Core web technologies for app functionality and styling.

# Troubleshooting

• **Webcam Access Issues**: Ensure your browser has permission to access the webcam. Check your system settings if the webcam is not detected.

• **FaceMesh Initialization**: If the FaceMesh module doesn't initialize, verify your internet connection since the model is loaded from a CDN.

• **Image Upload Errors**: Confirm that the uploaded file is a valid image and that the file size is reasonable.

# Contributing

Contributions are welcome! Please fork this repository, make your
changes, and submit a pull request. For major changes, please open an
issue first to discuss what you would like to change. 

# License

This project is licensed under the MIT License.

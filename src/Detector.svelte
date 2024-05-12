<script lang="js">
  import "./styles.css";
  import { onMount } from "svelte";
  import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
  import { registerStudent}  from './services';

  export let user;

  onMount(async () => {

    // Constants
    const filesetResolverBasePath = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm";
    const fdModelAssetPath = "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";
    const fdDelegate = "GPU";
    const fdRunningMode = "VIDEO";

    // Elements
    const detectorSection = document.getElementById("detector");
    const video = document.getElementById("webcam");
    const liveView = document.getElementById("liveView");
    const enableWebcamButton = document.getElementById("webcamButton");
    const captureButton = document.getElementById("captureButton");
    const canvas = document.getElementById("myCanvas");

    // Variables
    let faceDetector = null;
    let lastVideoTime = -1;

    const initializeFaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(filesetResolverBasePath);
      const faceDetectorOptions = { baseOptions: { modelAssetPath: fdModelAssetPath, delegate: fdDelegate }, runningMode: fdRunningMode };
      faceDetector = await FaceDetector.createFromOptions(vision, faceDetectorOptions);
      detectorSection.classList.remove("invisible");
      enableWebcamButton.addEventListener("click", enableCam);
      captureButton.addEventListener("click", capture);
      setGeolocation();
    };

    const setGeolocation = () => {
      if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(
          (pos) => {
				    localStorage.setItem('latitude', JSON.stringify(pos.coords.latitude));
				    localStorage.setItem('longitude', JSON.stringify(pos.coords.longitude));
            localStorage.setItem('accuracy', JSON.stringify(pos.coords.accuracy));
          },
          () => {
            console.log("Error retrieving location");
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
		  }
		  else {
			  console.log("Geolocation is not supported by this browser.");
		  }
    };

    const enableCam = async () => {
      if (!faceDetector) {
        alert("Face Detector is still loading. Please try again..");
        return;
      }
      enableWebcamButton.classList.add("removed");
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
          video.addEventListener("loadeddata", predictWebcam);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const predictWebcam = async () => {
      let startTimeMs = performance.now();
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        const detections = faceDetector.detectForVideo(video, startTimeMs).detections;
        if (detections.length == 1) captureButton.disabled = false;
        else captureButton.disabled = true;
      }
      window.requestAnimationFrame(predictWebcam);
    };

    const capture = () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL();
      const img = document.createElement("img");
      img.src = dataURL;
      registerStudent(user.email, img.src, localStorage.getItem('latitude'), localStorage.getItem('longitude'), localStorage.getItem('accuracy'));
    };

    initializeFaceDetector();

  });
</script>

<section id="detector" class="invisible">
  <div id="liveView" class="videoView">
    <button id="webcamButton" class="mdc-button mdc-button--raised">
      <span class="mdc-button__ripple"></span>
      <span class="mdc-button__label">Habilitar cámara</span>
    </button>
    <video id="webcam" autoplay playsinline><track kind="captions"></video>
    <canvas id="myCanvas" style="display: none;"></canvas>
    <button id="captureButton"> Tomar foto </button>
  </div>
</section>

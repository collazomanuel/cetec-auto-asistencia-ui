<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
	import { registerStudent } from './services';

	export let user;

	let video;
	let canvas;
	let faceDetector;

	const isFaceDetected = writable(false);

	const setGeolocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					localStorage.setItem('latitude', JSON.stringify(pos.coords.latitude));
					localStorage.setItem('longitude', JSON.stringify(pos.coords.longitude));
					localStorage.setItem('accuracy', JSON.stringify(pos.coords.accuracy));
				},
				() => {
					console.log('Error retrieving location');
				},
				{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
			);
		} else {
			console.log('Geolocation is not supported by this browser.');
		}
	};

	onMount(() => {
		initializeFaceDetector();
		return () => {
			const stream = video.srcObject;
			if (stream) stream.getTracks().forEach((track) => track.stop());
		};
	});

	async function initializeFaceDetector() {
		const filesetResolverBasePath =
			'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm';
		const fdModelAssetPath =
			'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';
		const fdDelegate = 'GPU';
		const fdRunningMode = 'VIDEO';
		const vision = await FilesetResolver.forVisionTasks(filesetResolverBasePath);
		const faceDetectorOptions = {
			baseOptions: { modelAssetPath: fdModelAssetPath, delegate: fdDelegate },
			runningMode: fdRunningMode
		};
		faceDetector = await FaceDetector.createFromOptions(vision, faceDetectorOptions);
		startWebcam();
		setGeolocation();
	}

	async function startWebcam() {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video.srcObject = stream;
		predictWebcam();
	}

	async function predictWebcam() {
		if (video && video.readyState == 4) {
			const detections = await faceDetector.detectForVideo(video, performance.now()).detections;
			isFaceDetected.set(await faceDetector.detectForVideo(video, performance.now()).detections.length === 1);
		}
		window.requestAnimationFrame(predictWebcam);
	}

	function capture() {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		const email = user.email;
		const dataURL = canvas.toDataURL();
		const latitude = localStorage.getItem('latitude');
		const longitude = localStorage.getItem('longitude');
		const accuracy = localStorage.getItem('accuracy');
		registerStudent(email, dataURL, latitude, longitude, accuracy);
	}
</script>

<section class='app'>
	<div class='camera'>
		<video bind:this={video} autoplay playsinline style='border-color: {$isFaceDetected ? 'green' : 'red'}'>
			<track kind='captions'/>
		</video>
		<canvas bind:this={canvas} style='display: none;'></canvas>
	</div>
	<button class='button' on:click={capture} disabled={!$isFaceDetected}> Tomar foto </button>
</section>

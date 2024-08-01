<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
	import { LoadRing } from 'svelte-loading-animation';
	import { getExams, registerStudent, registerAttendance } from './services';

	export let user;

	let video;
	let canvas;
	let faceDetector;

	const isFaceDetected = writable(false);
	const loading = writable(false);
	const result = writable('Empty');

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
			isFaceDetected.set(detections.length === 1);
		}
		window.requestAnimationFrame(predictWebcam);
	}

	async function capture() {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		const photo = canvas.toDataURL();
		const code = "123_Test";
		const email = user.email;
		const latitude = localStorage.getItem('latitude');
		const longitude = localStorage.getItem('longitude');
		const accuracy = localStorage.getItem('accuracy');
		loading.set(true);
		const response = await registerAttendance(code, email, latitude, longitude, accuracy, photo);
		loading.set(false);
		result.set(response);
		console.log(response);
	}
</script>

<section>
	{#if $loading}
		<LoadRing color="green" />
	{:else if $result != 'Empty'}
		{#if $result == 'Valid'}
			<h1 style="color: green">Asistencia registrada ✓</h1>
		{:else if $result == 'Invalid location'}
			<h1 style="color: red">Error con la validación de ubicación</h1>
		{:else if $result == 'Invalid face'}
			<h1 style="color: red">Error con el reconocimiento facial</h1>
		{/if}
	{:else}
		<div class="camera">
			<video
				bind:this={video}
				autoplay
				playsinline
				style="border-color: {$isFaceDetected ? 'green' : 'red'}"
			>
				<track kind="captions" />
			</video>
			<canvas bind:this={canvas} style="display: none"></canvas>
		</div>
		<button class="button" on:click={capture} disabled={!$isFaceDetected}> Tomar foto </button>
	{/if}
</section>

<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
	import { LoadRing } from 'svelte-loading-animation';
	import { Styles, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
	import { getExams, registerStudent, registerAttendance } from './services';

	const Mode = {
		DEFAULT: 0,
		INIT: 1,
		LOADING: 2,
		REGISTER: 3,
		ATTENDANCE: 4,
		RESULT: 5
	};

	export let user;

	let video;
	let canvas;
	let faceDetector;

	const mode = writable(Mode.INIT);
	const isFaceDetected = writable(false);
	const coords = writable(null);
	const availableExams = writable([]);
	const selectedExam = writable(null);
	const result = writable(null);

	const initializeFaceDetector = async () => {
		const filesetResolverBasePath = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm';
		const fdModelAssetPath = 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';
		const fdDelegate = 'GPU';
		const fdRunningMode = 'VIDEO';
		const vision = await FilesetResolver.forVisionTasks(filesetResolverBasePath);
		const faceDetectorOptions = {
			baseOptions: { modelAssetPath: fdModelAssetPath, delegate: fdDelegate },
			runningMode: fdRunningMode
		};
		faceDetector = await FaceDetector.createFromOptions(vision, faceDetectorOptions);
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video.srcObject = stream;
		await predictWebcam();
	};

	const predictWebcam = async () => {
		if (video && video.readyState == 4) {
			const detections = await faceDetector.detectForVideo(video, performance.now()).detections;
			isFaceDetected.set(detections.length === 1);
		}
		window.requestAnimationFrame(predictWebcam);
	};

	const setGeolocation = async () => {
		navigator?.geolocation.getCurrentPosition(
			(pos) => { coords.set(pos.coords) },
			() => { console.log('Error retrieving location') },
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
		);
	};

	const setExams = async () => {
		const response = await getExams();
		availableExams.set(response);
	};

	const handleSubmit = async () => {
		const email = user.email;
		const image = await capturePhoto();
		if ($mode == Mode.REGISTER) {
			mode.set(Mode.LOADING);
			const response = await registerStudent(email, image);
			result.set(response);
			mode.set(Mode.RESULT);
		} else if ($mode == Mode.ATTENDANCE) {
			mode.set(Mode.LOADING);
			const code = $selectedExam.code;
			const latitude = $coords.latitude;
			const longitude = $coords.longitude;
			const accuracy = $coords.accuracy;
			const response = await registerAttendance(email, code, latitude, longitude, accuracy, image);
			result.set(response);
			mode.set(Mode.RESULT);
		} else {
			console.log('Invalid submit mode');
		}
	};

	const capturePhoto = async () => {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL();
	};

	onMount(async () => {
		mode.set(Mode.INIT);
		await initializeFaceDetector();
		await setGeolocation();
		await setExams();
		mode.set(Mode.DEFAULT);
		return () => {
			const stream = video.srcObject;
			if (stream) stream.getTracks().forEach((track) => track.stop());
		};
	});
</script>

<section>
	<div class='result'>
		{#if $mode == Mode.LOADING || $mode == Mode.INIT}
			<LoadRing class='ring' />
		{:else if $mode == Mode.RESULT}
			{#if $result == 'attendance_valid'}
				<h3 class='success'>Asistencia registrada ✓</h3>
			{:else if $result == 'attendance_error_email'}
				<h3 class='error'>Error: Correo no registrado</h3>
			{:else if $result == 'attendance_error_location'}
				<h3 class='error'>Error: Ubicación inválida</h3>
			{:else if $result == 'attendance_error_face'}
				<h3 class='error'>Error: Reconocimiento facial inválido</h3>
			{:else if $result == 'registration_valid'}
				<h3 class='success'>Usuario registrado ✓</h3>
			{:else if $result == 'registration_error_email'}
				<h3 class='error'>Error: Correo ya registrado</h3>
			{/if}
			<button class='button returnButton' on:click={() => {result.set(null); mode.set(Mode.DEFAULT);}}> Regresar </button>
		{/if}
	</div>
	<div class='detector' style={$mode == Mode.INIT || $mode == Mode.LOADING || $mode == Mode.RESULT ? 'visibility: hidden;' : ''}>
		<Styles />
		<Dropdown direction='down'>
			<DropdownToggle color='white' caret>
				{$mode == Mode.ATTENDANCE
					? $selectedExam.name
					: $mode == Mode.REGISTER
						? 'Registrarse'
						: 'Elegir acción'}
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem header>Agregar asistencia</DropdownItem>
				{#each $availableExams as exam}
					<DropdownItem
						active={$mode == Mode.ATTENDANCE && $selectedExam === exam}
						on:click={() => {
							selectedExam.set(exam);
							mode.set(Mode.ATTENDANCE);
						}}
					>
						{exam.name}
					</DropdownItem>
				{/each}
				<DropdownItem divider />
				<DropdownItem
					active={$mode == Mode.REGISTER}
					on:click={() => {
						mode.set(Mode.REGISTER);
					}}
				>
					Registrarse
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>

		<div class='camera'>
			<video
				bind:this={video}
				autoplay
				playsinline
				class= {$isFaceDetected ? 'success' : 'error'}
			>
				<track kind='captions' />
			</video>
			<canvas bind:this={canvas}></canvas>
		</div>
		<button
			class='button'
			on:click={handleSubmit}
			disabled={!(
				$coords != null &&
				$isFaceDetected &&
				($mode == Mode.ATTENDANCE || $mode == Mode.REGISTER)
			)}
		>
			Tomar foto
		</button>
	</div>
</section>

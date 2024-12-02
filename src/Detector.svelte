<script lang='ts'>
	import './styles.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
	import { LoadRing } from 'svelte-loading-animation';
	import { Styles, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
	import { getExams, addStudent, addAttendance } from './services';
	import ResultMessage from '../src/ResultMessage.svelte';

	import type { UserType, ExamType, AttendanceType } from '$lib/types/exam.type';

	import { Mode } from '$lib/types/enums';

	export let user: UserType;
	export let userToken: string;

	let video: any;
	let canvas: any;
	let faceDetector: any;

	let mode: Mode | null = null;
	let result: string | null = null;
	let availableExams: ExamType[] | null = null;
	let selectedExam: ExamType | null = null;

	let isFaceDetected: boolean | null = null;
	let coords: any = null;

	const initializeFaceDetector = async () => {
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
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		video.srcObject = stream;
		await predictWebcam();
	};

	const predictWebcam = async () => {
		if (video && video.readyState == 4) {
			const detections = await faceDetector.detectForVideo(video, performance.now()).detections;
			isFaceDetected = detections.length == 1;
		}
		window.requestAnimationFrame(predictWebcam);
	};

	const setGeolocation = async () => {
		navigator?.geolocation.getCurrentPosition(
			(pos) => {
				coords = pos.coords;
			},
			() => {
				console.log('Error retrieving location');
			},
			{ enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
		);
	};

	const setExams = async () => {
		availableExams = await getExams(true);
	};

	const handleSubmit = async () => {
		const email = user.email;
		const image = await capturePhoto();
		if (mode == Mode.ADD_STUDENT) {
			mode = Mode.LOADING;
			const newStudent: UserType = {
				email: email,
				image: image
			};
			const response = await addStudent(newStudent, userToken);
			result = response;
			mode = Mode.RESULT;
		} else if (mode == Mode.ADD_ATTENDANCE) {
			mode = Mode.LOADING;
			const newAttendance: AttendanceType = {
				email: email,
				code: selectedExam!.code,
				latitude: coords.latitude,
				longitude: coords.longitude,
				accuracy: coords.accuracy,
				image: image
			};
			const response = await addAttendance(newAttendance, userToken);
			result = response;
			mode = Mode.RESULT;
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
		mode = Mode.INIT;
		isFaceDetected = false;
		await initializeFaceDetector();
		await setGeolocation();
		await setExams();
		mode = Mode.DEFAULT;
		return () => {
			video.srcObject?.getTracks().forEach((track) => track.stop());
		};
	});
</script>

<section>
	<div class='resultScreen'>
		{#if mode == Mode.LOADING || mode == Mode.INIT}
			<LoadRing class='ring' />
		{:else if mode == Mode.RESULT}
			<ResultMessage {result} />
			<button
				class='button returnButton'
				on:click={() => {
					result = null;
					mode = Mode.DEFAULT;
				}}
			>
				Regresar
			</button>
		{/if}
	</div>
	<div
		class='detector'
		style={mode == Mode.INIT || mode == Mode.LOADING || mode == Mode.RESULT
			? 'visibility: hidden;'
			: ''}
	>
		<Styles />
		<Dropdown direction='down'>
			<DropdownToggle color='white' caret>
				{mode == Mode.ADD_ATTENDANCE
					? selectedExam!.name
					: mode == Mode.ADD_STUDENT
						? 'Registrarse'
						: 'Elegir acción'}
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem
					active={mode == Mode.ADD_STUDENT}
					on:click={() => {
						mode = Mode.ADD_STUDENT;
					}}
				>
					Registrarse
				</DropdownItem>
				<DropdownItem divider />
				<DropdownItem header>Agregar asistencia</DropdownItem>
				{#each availableExams! as exam}
					<DropdownItem
						active={mode == Mode.ADD_ATTENDANCE && selectedExam === exam}
						on:click={() => {
							selectedExam = exam;
							mode = Mode.ADD_ATTENDANCE;
						}}
					>
						{exam.name}
					</DropdownItem>
				{/each}
			</DropdownMenu>
		</Dropdown>

		<div class='camera'>
			<video bind:this={video} autoplay playsinline class={isFaceDetected ? 'success' : 'error'}>
				<track kind='captions' />
			</video>
			<canvas bind:this={canvas}></canvas>
		</div>
		<button
			class='button'
			on:click={handleSubmit}
			disabled={!(
				coords != null &&
				isFaceDetected &&
				(mode == Mode.ADD_ATTENDANCE || mode == Mode.ADD_STUDENT)
			)}
		>
			Tomar foto
		</button>
	</div>
</section>

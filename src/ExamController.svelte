<script lang="ts">
	import './styles.css';

	import { onMount } from 'svelte';
	import {
		Styles,
		Input,
		Dropdown,
		DropdownToggle,
		DropdownMenu,
		DropdownItem
	} from '@sveltestrap/sveltestrap';

	import { getExams, addExam, editExam } from './services';
	import ResultMessage from '../src/ResultMessage.svelte';
	import LoadingSpinner from '../src/LoadingSpinner.svelte';

	import type { ExamType } from '$lib/types';

	import { Mode } from '$lib/types/enums';

	export let userToken: string;

	let mode: Mode | null = null;
	let result: string | null = null;
	let availableExams: ExamType[] | null = null;
	let selectedExam: ExamType | null = null;

	let code: string | null = null;
	let name: string | null = null;
	let start: string | null = null;
	let length: number | null = null;
	let margin: number | null = null;

	const formatDatetime = (datetime: string) => {
		let [datePart, timePart] = datetime.split('T');
		let [year, month, day] = datePart.split('-');
		let [hour, minute] = timePart.split(':');
		let period = 'AM';
		let _hour = parseInt(hour, 10);
		if (_hour >= 12) {
			period = 'PM';
			if (_hour > 12) {
				_hour -= 12;
			}
		} else if (_hour === 0) {
			_hour = 12;
		}
		hour = _hour.toString();
		let formattedTime = `${hour}:${minute} ${period}`;
		let formattedDate = `${day}/${month}/${year}`;
		return `${formattedDate} ${formattedTime}`;
	};

	const setExams = async () => {
		try {
			availableExams = await getExams(false);
		} catch (error) {
			console.error('Failed to fetch exams: ', error);
		}
	};

	const createExamObject = (): ExamType => ({
		code: mode === Mode.EDIT_EXAM ? code! : '',
		name: name!,
		start: start!,
		length: length!,
		margin: margin!
	});

	function fillForm(selectedExam: ExamType) {
		code = selectedExam.code;
		name = selectedExam.name;
		start = selectedExam.start.replace(' ', 'T');
		length = selectedExam.length;
		margin = selectedExam.margin;
	}

	const resetForm = () => {
		selectedExam = null;
		code = null;
		name = null;
		start = null;
		length = null;
		margin = null;
	};

	const handleSubmit = async () => {
		try {
			const exam = createExamObject();
			const selectedMode = mode;
			mode = Mode.LOADING;
			if (selectedMode === Mode.ADD_EXAM)
				result = await addExam(exam, userToken);
			else if (selectedMode === Mode.EDIT_EXAM)
				result = await editExam(exam, userToken);
			else throw new Error('Invalid submit mode');
			mode = Mode.RESULT;
		} catch (error) {
			console.error('Failed to submit exam:', error);
		} finally {
			await setExams();
		}
	};

	onMount(async () => {
		mode = Mode.INIT;
		await setExams();
		mode = Mode.DEFAULT;
	});
</script>

<section>
	<div class="resultScreen">
		{#if mode == Mode.LOADING || mode == Mode.INIT}
			<LoadingSpinner />
		{:else if mode == Mode.RESULT}
			<ResultMessage {result} />
			<button
				class="button returnButton"
				on:click={() => {
					resetForm();
					result = null;
					mode = Mode.DEFAULT;
				}}
			>
				Regresar
			</button>
		{/if}
	</div>
	<div
		class="exam"
		style={mode == Mode.INIT || mode == Mode.LOADING || mode == Mode.RESULT
			? 'visibility: hidden;'
			: ''}
	>
		<Styles />
		<Dropdown direction="down" class="dropdown">
			<DropdownToggle color="white" caret>
				{mode == Mode.DEFAULT
					? 'Elegir acción'
					: mode == Mode.EDIT_EXAM
						? selectedExam?.name
						: mode == Mode.ADD_EXAM
							? 'Nuevo examen'
							: ''}
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem
					active={mode == Mode.ADD_EXAM}
					on:click={() => {
						resetForm();
						mode = Mode.ADD_EXAM;
					}}
				>
					Agregar nuevo examen
				</DropdownItem>
				<DropdownItem divider />
				<DropdownItem header>Editar examen</DropdownItem>
				{#each availableExams ?? [] as availableExam: ExamType}
					<DropdownItem
						active={mode == Mode.EDIT_EXAM && selectedExam === availableExam}
						on:click={() => {
							selectedExam = availableExam as ExamType;
							fillForm(selectedExam);
							mode = Mode.EDIT_EXAM;
						}}
					>
						{availableExam?.name}
					</DropdownItem>
				{/each}
			</DropdownMenu>
		</Dropdown>

		{#if mode != Mode.DEFAULT}
			<Input
				class="input name"
				type="text"
				placeholder="Ingresar nombre"
				bind:value={name}
			/>
			<div class="datetimeContainer">
				<Input
					class="input datetime calendar"
					type="datetime-local"
					placeholder="Comienzo"
					bind:value={start}
				/>
				<p class="input datetime">
					{start ? formatDatetime(start) : 'Ingresar fecha y hora'}
				</p>
			</div>
			<div class="lengthContainer">
				<p class="input length">Duración:</p>
				<Input
					class="input length lengthInput"
					type="number"
					placeholder="------"
					min="0"
					bind:value={length}
				/>
				<p class="input length">minutos</p>
			</div>
			<div class="marginContainer">
				<p class="input margin">Margen:</p>
				<Input
					class="input margin marginInput"
					type="number"
					placeholder="------"
					min="0"
					bind:value={margin}
				/>
				<p class="input length">minutos</p>
			</div>
			<button
				class="button examButton"
				on:click={handleSubmit}
				disabled={!(name && start && length && margin) &&
					!(mode == Mode.ADD_EXAM || mode == Mode.EDIT_EXAM)}
			>
				{mode == Mode.ADD_EXAM
					? 'Agregar examen'
					: mode == Mode.EDIT_EXAM
						? 'Editar examen'
						: ''}
			</button>
		{/if}
	</div>
</section>

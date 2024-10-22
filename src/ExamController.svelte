<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { LoadRing } from 'svelte-loading-animation';
	import { Styles, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
	import { getExams, addExam, editExam } from './services';
	import ResultMessage from '../src/ResultMessage.svelte';

	const Mode = {
		DEFAULT: 0,
		INIT: 1,
		LOADING: 2,
		RESULT: 3,
		ADD_EXAM: 4,
		EDIT_EXAM: 5
	};

	export let user;

	const mode = writable(null);
	const result = writable(null);
	const availableExams = writable([]);
	const selectedExam = writable(null);

	let code = null;
	let name = null;
	let start = null;
	let length = null;
	let margin = null;

	const formatDatetime = (datetime) => {
		let [datePart, timePart] = datetime.split('T');
		let [year, month, day] = datePart.split('-');
		let [hour, minute] = timePart.split(':');
		let period = 'AM';
		hour = parseInt(hour, 10);
		if (hour >= 12) {
			period = 'PM';
			if (hour > 12) {
				hour -= 12;
			}
		} else if (hour === 0) {
			hour = 12;
		}
		let formattedTime = `${hour}:${minute} ${period}`;
		let formattedDate = `${day}/${month}/${year}`;
		return `${formattedDate} ${formattedTime}`;
	};

	const setExams = async () => {
		const response = await getExams();
		availableExams.set(response);
	};

	const handleSubmit = async () => {
		if ($mode == Mode.ADD_EXAM) {
			mode.set(Mode.LOADING);
			const response = await addExam(user.email, name, start.replace("T", " "), length, margin);
			result.set(response);
			mode.set(Mode.RESULT);
		} else if ($mode == Mode.EDIT_EXAM) {
			mode.set(Mode.LOADING);
			const response = await editExam(user.email, code, name, start.replace("T", " "), length, margin);
			result.set(response);
			mode.set(Mode.RESULT);
		} else {
			console.log('Invalid submit mode');
		}
		await setExams();
	};

	onMount(async () => {
		mode.set(Mode.INIT);
		await setExams();
		mode.set(Mode.DEFAULT);
		return () => {};
	});
</script>

<section>
	<div class="resultScreen">
		{#if $mode == Mode.LOADING || $mode == Mode.INIT}
			<LoadRing class="ring" />
		{:else if $mode == Mode.RESULT}
			<ResultMessage result={$result} />
			<button
				class="button returnButton"
				on:click={() => {
					result.set(null);
					code = null;
					name = null;
					start = null;
					length = null;
					margin = null;
					mode.set(Mode.DEFAULT);
				}}
			>
				Regresar
			</button>
		{/if}
	</div>
	<div
		class="exam"
		style={$mode == Mode.INIT || $mode == Mode.LOADING || $mode == Mode.RESULT
			? 'visibility: hidden;'
			: ''}
	>
		<Styles />
		<Dropdown direction='down' class='dropdown'>
			<DropdownToggle color='white' caret>
				{$mode == Mode.DEFAULT ? 'Elegir acción' : $mode == Mode.EDIT_EXAM ? $selectedExam.name : $mode == Mode.ADD_EXAM ? 'Nuevo examen' : ''}
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem
					active={$mode == Mode.ADD_EXAM}
					on:click={() => {
						selectedExam.set(null);
						code = null;
						name = null;
						start = null;
						length = null;
						margin = null;
						mode.set(Mode.ADD_EXAM);
					}}
				>
					Agregar nuevo examen
				</DropdownItem>
				<DropdownItem divider />
				<DropdownItem header>Editar examen</DropdownItem>
				{#each $availableExams as exam}
					<DropdownItem
						active={$mode == Mode.EDIT_EXAM && $selectedExam === exam}
						on:click={() => {
							selectedExam.set(exam);
							code = exam.code;
							name = exam.name;
							start = exam.start.replace(" ", "T");
							length = exam.length;
							margin = exam.margin;
							mode.set(Mode.EDIT_EXAM);
						}}
					>
						{exam.name}
					</DropdownItem>
				{/each}
			</DropdownMenu>
		</Dropdown>

		{#if $mode != Mode.DEFAULT}
			<Input class="input name" type="text" placeholder="Ingresar nombre" bind:value={name} />
			<div class="datetimeContainer">
				<Input class="input datetime calendar" type="datetime-local" placeholder="Comienzo" bind:value={start} />		
				<p class="input datetime">{start ? formatDatetime(start) : "Ingresar fecha y hora"}</p>
			</div>
			<div class="lengthContainer">
				<p class="input length">Duración: </p>
				<Input class="input length lengthInput" type="number" placeholder="------" min="0" bind:value={length} />
				<p class="input length">minutos</p>
			</div>
			<div class="marginContainer">
				<p class="input margin">Margen: </p>
				<Input class="input margin marginInput" type="number" placeholder="------" min="0" bind:value={margin} />
				<p class="input length">minutos</p>
			</div>
			<button
				class="button examButton"
				on:click={handleSubmit}
				disabled={!(name && start && length && margin) && ($mode != Mode.ADD_EXAM || $mode != Mode.EDIT_EXAM)}
			>
				{$mode == Mode.ADD_EXAM ? 'Agregar examen' : $mode == Mode.EDIT_EXAM ? 'Editar examen' : '' }
			</button>
		{/if}
	</div>
</section>

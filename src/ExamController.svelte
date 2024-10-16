<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { LoadRing } from 'svelte-loading-animation';
	import { Styles, Input } from 'sveltestrap';
	import { registerExam } from './services';

	const Mode = {
		DEFAULT: 0,
		INIT: 1,
		LOADING: 2,
		RESULT: 3,
		EXAM: 4
	};

	export let user;

	const mode = writable(Mode.INIT);
	const result = writable(null);

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

	const handleSubmit = async () => {
		if ($mode == Mode.EXAM) {
			mode.set(Mode.LOADING);
			const response = await registerExam(user.email, name, start.replace("T", " "), length, margin);
			result.set(response);
			mode.set(Mode.RESULT);
		} else {
			console.log('Invalid submit mode');
		}
	};

	onMount(async () => {
		mode.set(Mode.INIT);
		mode.set(Mode.DEFAULT);
		mode.set(Mode.EXAM);
		return () => {};
	});
</script>

<section>
	<div class="result">
		{#if $mode == Mode.LOADING || $mode == Mode.INIT}
			<LoadRing class="ring" />
		{:else if $mode == Mode.RESULT}
			{#if $result == 'exam_valid'}
				<h3 class="success">Examen registrado ✓</h3>
			{:else if $result == 'exam_error_email'}
				<h3 class="error">Error: Usuario sin permisos</h3>
			{/if}
			<button
				class="button returnButton"
				on:click={() => {
					result.set(null);
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
		<Input class="input name" type="text" placeholder="Nombre" bind:value={name} />
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
			disabled={!(name && start && length && margin) && $mode == Mode.EXAM}
		>
			Agregar examen
		</button>
	</div>
</section>

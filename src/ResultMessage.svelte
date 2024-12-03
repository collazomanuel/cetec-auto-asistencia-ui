<script lang='ts'>
	import './styles.css';
	import { onMount } from 'svelte';

	export let result;

	onMount(async () => {
	});

	const getResultClass = (result : string) => {
		if (result.startsWith('SUCCESS'))
			return 'success';
		else if (result.startsWith('ERROR'))
			return 'error';
		else
			return '';
	};

	const getResultText = (result : string) => {
		switch (result) {
			case 'SUCCESS_STUDENT_ADD':
				return 'Usuario registrado ✓';
			case 'ERROR_STUDENT_AUTH':
				return 'Error: Acceso denegado';
			case 'ERROR_STUDENT_EMAIL':
				return 'Error: Correo ya registrado';

			case 'SUCCESS_EXAM_ADD':
				return 'Examen registrado ✓';
			case 'SUCCESS_EXAM_EDIT':
				return 'Examen actualizado ✓';
			case 'ERROR_EXAM_AUTH':
				return 'Error: Acceso denegado';
			case 'ERROR_EXAM_CODE':
				return 'Error: Examen no reconocido';

			case 'SUCCESS_ATTENDANCE_ADD':
				return 'Asistencia registrada ✓';
			case 'ERROR_ATTENDANCE_AUTH':
				return 'Error: Acceso denegado';
			case 'ERROR_ATTENDANCE_EMAIL':
				return 'Error: Correo no registrado';
			case 'ERROR_ATTENDANCE_LOCATION':
				return 'Error: Ubicación inválida';
			case 'ERROR_ATTENDANCE_FACE':
				return 'Error: Reconocimiento facial inválido';

			default:
				return 'Error de comunicación con el servicio, intente nuevamente más tarde';
		}
	};

</script>

<section>
	<h3 class={getResultClass(result)}>{getResultText(result)}</h3>
</section>

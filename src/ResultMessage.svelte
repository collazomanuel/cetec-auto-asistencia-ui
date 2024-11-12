<script>
	import './styles.css';
	import { onMount } from 'svelte';

	export let result;

	onMount(async () => {
		return () => {};
	});

	const getResultClass = (result) => {
		switch (result) {
			case 'exam_valid':
			case 'exam_update':
			case 'attendance_valid':
			case 'registration_valid':
				return 'success';
			case 'attendance_error_auth':
			case 'attendance_error_email':
			case 'attendance_error_location':
			case 'attendance_error_face':
			case 'student_error_auth':
			case 'exam_error_auth':
			case 'registration_error_email':
				return 'error';
			default:
				return '';
		}
	};

	const getResultText = (result) => {
		switch (result) {
			case 'exam_valid':
				return 'Examen registrado ✓';
			case 'exam_update':
				return 'Examen actualizado ✓';
			case 'attendance_valid':
				return 'Asistencia registrada ✓';
			case 'registration_valid':
				return 'message';
			case 'attendance_error_email':
				return 'Error: Correo no registrado';
			case 'attendance_error_location':
				return 'Error: Ubicación inválida';
			case 'attendance_error_face':
				return 'Error: Reconocimiento facial inválido';
			case 'registration_valid':
				return 'Usuario registrado ✓';
			case 'registration_error_email':
				return 'Error: Correo ya registrado';
			case 'exam_error_email':
				return 'Error: Usuario sin permisos';
			case 'exam_error_code':
				return 'Error: Examen no reconocido';
			case 'exam_error_auth':
			case 'attendance_error_auth':
			case 'student_error_auth':
				return 'Error: Acceso denegado';
			default:
				return 'Error de comunicación con el servicio, intente nuevamente más tarde';
		}
	};

</script>

<section>
	<h3 class={getResultClass(result)}>{getResultText(result)}</h3>
</section>

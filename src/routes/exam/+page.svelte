<script>
	import '../../styles.css';
	import ExamController from '../../ExamController.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<div class="app">
	{#if $page.data.session}
		<ExamController userToken={$page.data.session.access_token ?? ''} />
		<button class="button logout" on:click={() => signOut()}>
			Cerrar sesión
		</button>
	{:else}
		<button class="button" on:click={() => signIn('google')}>
			Iniciar sesión con Google
		</button>
	{/if}
</div>

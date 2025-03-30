<script>
	import '../../styles.css';
	import ExamController from '../../ExamController.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<div class="app">
	{#if $page.data.session}
		<ExamController
			userToken={$page.data.session?.access_token}
		/>
	{:else}
		<button class="button" on:click={() => signIn('google')}>
			Iniciar sesión con Google
		</button>
	{/if}
</div>

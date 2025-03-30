<script>
	import '../styles.css';
	import Detector from '../Detector.svelte';
	import { signIn } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<div class="app">
	{#if $page.data.session}
		<Detector
			user={$page.data.session?.user}
			userToken={$page.data.session?.access_token}
		/>
	{:else}
		<button class="button" on:click={() => signIn('google')}>
			Iniciar sesión con Google
		</button>
	{/if}
</div>

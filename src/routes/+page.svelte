<script>
	import Detector from '../Detector.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<div>
	{#if $page.data.session}
        <Detector user={$page.data.session.user}/>
	{:else}
		<button on:click={() => signIn('google')}> Iniciar sesión con Google </button>
	{/if}
</div>

<script lang="ts">
	import '../app.css';
	import { onDestroy, onMount } from 'svelte';
	import { wsStore } from '$lib/stores/websocket';
	import { browser } from '$app/environment';
	import NavigationBar from '$lib/components/NavigationBar/NavigationBar.svelte';

	let { children } = $props();
	let connected = $state(false);
	let messages = $state<any[]>([]);

	$effect(() => {
		const unsubscribe = wsStore.subscribe((state) => {
			connected = state.connected;
			messages = state.messages;
		});
		return unsubscribe;
	});

	onMount(() => {
		if (browser) {
			wsStore.connect();
		}
	});

	onDestroy(() => {
		wsStore.disconnect();
	});
</script>

<div class="h-screen">
	<NavigationBar />

	<main class="bg-white dark:bg-black h-full">
		{@render children()}
	</main>
</div>

<style lang="postcss">
</style>

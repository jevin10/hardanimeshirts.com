<script lang="ts">
    import '../app.css';
    import { onDestroy, onMount } from 'svelte';
    import { wsStore } from '$lib/stores/websocket';
    import { browser } from '$app/environment';
    import NavigationBar from '$lib/components/NavigationBar/NavigationBar.svelte';
    import AnimatedTitle from './components/AnimatedTitle.svelte';

    let { children } = $props();
    let connected = $state(false);
    let messages = $state<any[]>([]);

    // Use $effect for store subscription
    $effect(() => {
        if (!browser) return;
        
        const unsubscribe = wsStore.subscribe((state) => {
            connected = state.connected;
            messages = state.messages;
        });

        // Connect when component mounts
        wsStore.connect();

        // Cleanup when component unmounts
        return () => {
            unsubscribe();
            wsStore.disconnect();
        };
    });
</script>

<AnimatedTitle />
<div class="h-screen">
    <NavigationBar />
    <main class="bg-white dark:bg-black h-full">
        {@render children()}
    </main>
</div>

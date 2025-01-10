<script lang="ts">
  import { getImageboardState } from '$lib/client/imageboard/Imageboard.svelte';
  import { getContext, onMount } from 'svelte';
  import { page } from '$app/stores';
  import Thread from '$lib/components/imageboard/Thread.svelte';
  import { goto } from '$app/navigation';
  import type { BoardContext } from '$lib/types/imageboard';
  import type { PageData } from './$types';
  import { getWsStore } from '$lib/stores/websocket';
  import type { ImageboardMessage } from '$lib/types/ws/messages/imageboard';
  import type { User } from 'lucia';

  let { data }: { data: PageData } = $props();

  const imageboardState = getImageboardState();
  const boardContext: BoardContext = getContext('BOARD_CTX');
  const wsStore = getWsStore();
  const user: User | null = getContext('USER_CTX');

  let fileInput = $state<HTMLInputElement | null>(null);
  let selectedFileName = $state('');

  let formData: {
    content: string;
    image: Uint8Array | null;
  } = $state({
    content: '',
    image: null
  });

  function scrollToReply() {
    document.querySelector('textarea')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleKeydown(event: KeyboardEvent) {
    // Submit on Enter but not if Shift is held (allow Shift+Enter for newlines)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent newline from being added
      createReply();
    }
  }

  function createReply() {
    if (boardContext.id === null || !imageboardState.activeThread) return;

    wsStore.send<ImageboardMessage>({
      domain: 'imageboard',
      action: 'create_post',
      data: {
        userId: user?.id ?? '',
        username: user?.username ?? 'Anonymous',
        boardId: boardContext.id,
        content: formData.content,
        image: uint8ArrayToObject(formData.image),
        parentId: imageboardState.activeThread.parent.id
      }
    });

    formData = {
      content: '',
      image: null
    };
  }

  // image conversion helper
  function uint8ArrayToObject(arr: Uint8Array | null) {
    if (!arr) return null;
    return Object.fromEntries(arr.entries());
  }

  // image handling functions
  async function handleImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      const bitmap = await createImageBitmap(file);

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(bitmap, 0, 0);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
          },
          'image/webp',
          0.8
        );
      });

      const arrayBuffer = await blob.arrayBuffer();
      formData.image = new Uint8Array(arrayBuffer);
      selectedFileName = file.name;
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      formData.image = null;
      selectedFileName = '';
    }

    input.value = '';
  }

  function clearImage() {
    formData.image = null;
    selectedFileName = '';
  }

  // TODO:
  // check if thread is in board
  // if not, make request for thread

  $effect(() => {
    imageboardState.activeThread;
    // set activeThread to page params
    if (data.threadId && imageboardState.activeBoard) {
      try {
        imageboardState.setActiveThread(Number(data.threadId));
      } catch (e) {
        console.log(e);
      }
    }
  });
</script>

<div class="mt-5 px-2 mx-3 border border-black dark:border-white">
  <button
    onclick={() => {
      goto(`/${boardContext.name}`);
    }}>[back]</button
  >
  <button onclick={scrollToReply}>[reply]</button>
</div>

<div class="mx-3 mt-5 pb-5">
  {#if imageboardState.activeThread}
    <input
      type="file"
      accept="image/*"
      class="hidden"
      bind:this={fileInput}
      onchange={handleImageSelect}
    />

    <Thread
      parent={imageboardState.activeThread.parent}
      children={imageboardState.activeThread.children}
      locked={imageboardState.activeThread.locked}
      expanded={true}
    />
    <div class="mt-2">
      <div class="text-xl">New Reply</div>
      <div>
        <button class="hover:underline" onclick={() => fileInput?.click()}> [attach image] </button>
      </div>
      {#if selectedFileName}
        <div class="flex gap-2 items-center">
          <span class="text-sm">{selectedFileName}</span>
          <button class="hover:underline" onclick={clearImage}>[x]</button>
        </div>
      {/if}
      <textarea
        bind:value={formData.content}
        onkeydown={handleKeydown}
        class="w-full md:w-[40rem] border border-black dark:border-white dark:bg-black resize-none text-lg p-2 leading-none"
        rows="5"
        spellcheck="false"
      ></textarea>
      <div class="w-full md:w-[40rem] flex justify-start gap-1">
        <button onclick={createReply}>[submit]</button>
      </div>
    </div>
  {:else}
    <div class="my-5"><span class="font-bold">Loading</span> | Getting post...</div>
  {/if}
</div>

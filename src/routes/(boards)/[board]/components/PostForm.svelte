<script lang="ts">
  import { page } from '$app/stores';
  import { getAuthModalState } from '$lib/components/AuthModal/AuthModalState.svelte';
  import { getWsStore, type WebSocketStore } from '$lib/stores/websocket';
  import type { ImageboardMessage } from '$lib/types/ws/messages/imageboard';
  import type { User } from 'lucia';
  import { getContext } from 'svelte';

  const user: User | null = getContext('USER_CTX');
  const authModalState = getAuthModalState();
  const wsStore: WebSocketStore = getWsStore();

  interface Props {
    boardId: number;
    boardName: string;
  }

  let { boardId, boardName }: Props = $props();

  // file input reference
  let fileInput = $state<HTMLInputElement | null>(null);
  let selectedFileName = $state('');

  let formData: {
    content: string;
    image: Uint8Array | null;
  } = $state({
    content: '',
    image: null
  });

  function uint8ArrayToObject(arr: Uint8Array | null) {
    if (!arr) return null;
    return Object.fromEntries(arr.entries());
  }

  function createPost() {
    wsStore.send<ImageboardMessage>({
      domain: 'imageboard',
      action: 'create_post',
      data: {
        userId: user?.id ?? '',
        username: user?.username ?? 'Anonymous',
        boardId,
        content: formData.content,
        image: uint8ArrayToObject(formData.image),
        parentId: null
      }
    });

    formData = {
      content: '',
      image: null
    };
  }

  async function handleImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      // Create image bitmap from file
      const bitmap = await createImageBitmap(file);

      // Create canvas to convert to webp
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      // Draw image to canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(bitmap, 0, 0);

      // Convert to webp blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
          },
          'image/webp',
          0.8
        );
      });

      // Convert blob to UInt8Array
      const arrayBuffer = await blob.arrayBuffer();
      formData.image = new Uint8Array(arrayBuffer);
      selectedFileName = file.name;
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      formData.image = null;
      selectedFileName = '';
    }

    // Reset input
    input.value = '';
  }

  function clearImage() {
    formData.image = null;
    selectedFileName = '';
  }
</script>

{#if user}
  <input
    type="file"
    accept="image/*"
    class="hidden"
    bind:this={fileInput}
    onchange={handleImageSelect}
  />

  <div class="w-full md:w-[25rem]">
    <div class="grid grid-cols-4 gap-1 mt-1">
      <div
        class="text-xl text-bold border border-black dark:border-white col-span-4 p-1 flex justify-center"
      >
        New Post
      </div>
      <div class="border border-black dark:border-white flex justify-end px-1">Name</div>
      <div class="col-span-3 border border-black dark:border-white px-1">
        {user?.username ?? 'Anonymous'}
      </div>
      <div class="border border-black dark:border-white flex justify-end px-1">Image</div>
      <div
        class="col-span-3 border border-black dark:border-white px-1 flex justify-between items-center"
      >
        <button class="hover:underline" onclick={() => fileInput?.click()}> [attach image] </button>
        {#if selectedFileName}
          <div class="flex gap-2 items-center">
            <span class="text-sm">{selectedFileName}</span>
            <button class="hover:underline" onclick={clearImage}> [x] </button>
          </div>
        {/if}
      </div>
      <div class="border border-black dark:border-white flex justify-end px-1">Content</div>
      <textarea
        bind:value={formData.content}
        class="col-span-3 border text-lg border-black dark:border-white p-1 dark:bg-black leading-none"
        rows="5"
        spellcheck="false"
      ></textarea>
    </div>
    <button
      class="w-full md:w-[25rem] border border-black dark:border-white flex justify-center gap-1 mt-1"
      onclick={createPost}
    >
      [submit]
    </button>
  </div>
{:else}
  Posting disabled for non-users.
  <button
    onclick={() => {
      authModalState.openModal();
    }}
    class="link"
  >
    Login to post.
  </button>
{/if}

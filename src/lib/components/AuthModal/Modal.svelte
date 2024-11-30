<script lang="ts">
  import { getAuthModalState } from './AuthModalState.svelte';

  interface Props {
    display?: 'Login' | 'Sign Up';
  }

  const authModalState = getAuthModalState();

  let { display = 'Login' }: Props = $props();

  let errorMessage: string | null = $state(null);

  async function handleLoginSubmit() {
    try {
      await authModalState.submitLogin();
      // Handle success (e.g. show notification)
    } catch (err) {
      if (err instanceof Error) {
        errorMessage = 'Invalid username or password!';
      } else {
        errorMessage = 'An unexpected error occurred.';
      }
    }
  }
</script>

{#snippet login()}
  <div class="m-3 w-[18rem] md:w-[24rem]">
    <div class="my-5">
      <div class="text-4xl">Login</div>
      <div class="text-m">Welcome back. We all missed you :3</div>
    </div>
    <div class="my-5 flex flex-col gap-2">
      <input
        bind:value={authModalState.loginForm.username}
        class="w-full text-lg px-2 placeholder:text-gray-500"
        placeholder="username"
      />
      <input
        bind:value={authModalState.loginForm.password}
        class="w-full text-lg px-2 placeholder:text-gray-500"
        placeholder="password"
      />
    </div>
    {#if errorMessage}
      <div class="my-5">
        <div class="text-m text-red-400">{errorMessage}</div>
      </div>
    {/if}
    <div class="my-5">
      <div class="text-m">
        Don't have an account?
        <button
          class="link"
          onclick={() => {
            display = 'Sign Up';
          }}
        >
          Sign up
        </button>
      </div>
    </div>
    <div class="my-10 flex justify-center">
      <button class="text-2xl" onclick={handleLoginSubmit}>[login]</button>
    </div>
    <div class="my-5 flex justify-center text-center">
      <div class="text-xs">
        By continuing, you agree to the <button class="link">rules</button>.
      </div>
    </div>
  </div>
{/snippet}

{#snippet signup()}
  <div class="m-3 w-[18rem] md:w-[24rem]">
    <div class="my-5">
      <div class="text-4xl">Sign Up</div>
      <div class="text-m">
        If you need an invite code, <a href="x.com/1owroller" class="link">dm me</a>
      </div>
    </div>
    <div class="my-5 flex flex-col gap-2">
      <input
        bind:value={authModalState.signupForm.username}
        class="w-full text-lg px-2 placeholder:text-gray-500"
        placeholder="username (lowercase only)"
      />
      <input
        bind:value={authModalState.signupForm.password}
        class="w-full text-lg px-2 placeholder:text-gray-500"
        placeholder="password (8 characters, ≥1 symbol)"
      />
      <input
        bind:value={authModalState.signupForm.inviteCode}
        class="w-full text-lg px-2 placeholder:text-gray-500"
        placeholder="invite code"
      />
    </div>
    <div class="my-5">
      <div class="text-m">
        Already have an account?
        <button
          class="link"
          onclick={() => {
            display = 'Login';
          }}
        >
          Log in
        </button>
      </div>
    </div>
    <div class="my-10 flex justify-center">
      <button class="text-2xl">[sign up]</button>
    </div>
    <div class="my-5 flex justify-center text-center">
      <div class="text-xs">
        By continuing, you agree to the <button class="link">rules</button>.
      </div>
    </div>
  </div>
{/snippet}

{#if authModalState.isVisible}
  <div class="overlay">
    <div class="min-h-[60vh] md:h-[30rem] w-[30rem] m-5 modal flex flex-col">
      <div class="w-full border-b border-black dark:border-white flex flex-row justify-between p-1">
        <div class="text-m">Authenticate | {display}</div>
        <button
          onclick={() => {
            errorMessage = '';
            authModalState.closeModal();
          }}>[x]</button
        >
      </div>
      <div class="flex-1 flex items-center justify-center">
        {#if display === 'Login'}
          {@render login()}
        {:else if display === 'Sign Up'}
          {@render signup()}
        {/if}
      </div>
    </div>
  </div>
{/if}

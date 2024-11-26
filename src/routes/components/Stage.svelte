<script lang="ts">
  const messages = [
    "It's so cold in here.",
    "I won't be able to stay connected for long.",
    'What is this place?',
    'How did you get here?',
    'Find me, quickly.',
    'You have to think of yourself.'
  ];

  let text = $state('');
  let messageIndex = $state(0);
  let isDeleting = $state(false);

  // Typing effect
  $effect(() => {
    const currentMessage = messages[messageIndex];
    const shouldType = !isDeleting && text !== currentMessage;
    const shouldDelete = isDeleting && text !== '';

    let timeout: ReturnType<typeof setTimeout>;

    if (shouldType) {
      timeout = setTimeout(() => {
        text = currentMessage.slice(0, text.length + 1);
      }, 100);
    } else if (shouldDelete) {
      timeout = setTimeout(() => {
        text = text.slice(0, -1);
      }, 40);
    } else {
      timeout = setTimeout(() => {
        isDeleting = text !== '';
        if (text === '') {
          messageIndex = (messageIndex + 1) % messages.length;
        }
      }, 2000);
    }

    return () => clearTimeout(timeout);
  });
</script>

<div class="text-3xl">Stage 1: Discovery</div>
<div class="h-full flex text-lg">
  <span>{text}</span>
  <span class="w-1 h-6 bg-black dark:bg-white ml-1 animate-pulse"></span>
</div>

<script lang="ts">
  const messages = [
    'Just as you wear the shirt,',
    'The shirt wears you.',
    'This is not mere merchandise,',
    'This is fashion as contagion.',
    'As holy relic,',
    'As terminal velocity.'
  ];
  let text = $state('');
  let messageIndex = $state(0);
  let isDeleting = $state(false);
  let isIdle = $state(true);

  $effect(() => {
    const currentMessage = messages[messageIndex];
    const shouldType = !isDeleting && text !== currentMessage;
    const shouldDelete = isDeleting && text !== '';

    isIdle = !shouldType && !shouldDelete;

    let timeout: ReturnType<typeof setTimeout>;
    if (shouldType) {
      timeout = setTimeout(() => {
        text = currentMessage.slice(0, text.length + 1);
      }, 50);
    } else if (shouldDelete) {
      timeout = setTimeout(() => {
        text = text.slice(0, -1);
      }, 30);
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

<div class="h-8 text-lg relative text-center">
  <span class="whitespace-pre-wrap font-mono">{text}</span>
  <span
    class={`w-2 h-6 bg-black dark:bg-white ${isIdle ? 'animate-blink' : ''} absolute inline-block`}
    style="margin-left: 2px;"
  ></span>
</div>

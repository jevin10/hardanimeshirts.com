<script lang="ts">
  let targetDate = $state(new Date('2024-12-11T00:00:00'));
  let timeLeft = $state('00:00:00:00');

  $effect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        timeLeft = 'Time is up!';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timeLeft = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    return () => clearInterval(timer);
  });
</script>

<div class="flex flex-col items-center justify-center mt-10 gap-1">
  <div class="text-3xl">Be patient!</div>
  <div class="text-xl">Good things come to those who wait.</div>
  <div class="text-4xl mt-5">{timeLeft}</div>
</div>

<!-- src/routes/sponsor/+page.svelte -->
<script lang="ts">
    export let data: { slots: Array<any> };
    const reserve = (date: string) => {
      const f = document.createElement('form');
      f.method = 'post';
      f.innerHTML = `<input type="hidden" name="date" value="${date}">`;
      document.body.appendChild(f);
      f.submit();
    };
  </script>
  
  <h1 class="text-2xl font-semibold mb-4">Sponsor of the Day</h1>
  <p class="mb-6">Pick a date, pay, then submit your creative.</p>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    {#each data.slots as s}
      <button
        class="rounded-xl border p-3 text-left disabled:opacity-50"
        disabled={s.status !== 'available'}
        on:click={() => reserve(s.date)}
        title={s.status}
      >
        <div class="text-sm opacity-70">{new Date(s.date).toDateString()}</div>
        <div class="text-base font-medium">
          {s.status === 'available' ? 'Book this day' : s.status}
        </div>
      </button>
    {/each}
  </div>


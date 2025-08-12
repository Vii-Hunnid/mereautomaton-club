<!-- src/routes/poems/+page.svelte -->
<script>
  import PoemCard from '$lib/components/PoemCard.svelte'
  export let data
  let poems = data.poems || []

  /** @param {string} dateString */
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /** @param {string} subdomain */
  function getSubdomainUrl(subdomain) {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol
      const domain = window.location.hostname.includes('localhost') 
        ? `localhost:${window.location.port}`
        : 'mereautomaton.club'
      return `${protocol}//${subdomain}.${domain}`
    }
    return `https://${subdomain}.mereautomaton.club`
  }
</script>

<svelte:head>
  <title>All Poems - MereAutomaton.club</title>
  <meta name="description" content="Browse all AI-generated poems" />
</svelte:head>

<section class="py-16 bg-gray-50 min-h-screen">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-end justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-800">All Poems</h1>
      <a href="/create" class="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-colors">Create Poem</a>
    </div>

    {#if poems.length > 0}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each poems as poem (poem.id)}
          <PoemCard {poem} />
        {/each}
      </div>
    {:else}
      <div class="text-center py-24">
        <p class="text-gray-600 mb-6">No poems yet. Be the first to create one!</p>
        <a href="/create" class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Create the First Poem</a>
      </div>
    {/if}
  </div>
</section>



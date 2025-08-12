<!-- src/routes/poems/+page.svelte -->
<script>
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
          <div class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <h3 class="text-lg font-semibold mb-2">
              <a href={getSubdomainUrl(poem.subdomain)} class="text-purple-600 hover:text-purple-800" target="_blank" rel="noopener noreferrer">
                {poem.title}
              </a>
            </h3>
            <div class="flex flex-wrap gap-2 mb-3 text-xs">
              {#if poem.style}<span class="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{poem.style}</span>{/if}
              {#if poem.theme}<span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{poem.theme}</span>{/if}
            </div>
            <p class="font-serif text-gray-700 mb-4 leading-relaxed line-clamp-4">{poem.content}</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>{formatDate(poem.created_at)}</span>
              <span>{poem.views || 0} views</span>
            </div>
          </div>
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



<!-- src/lib/components/PoemCard.svelte -->
<script>
  export let poem = {
    id: '',
    title: '',
    content: '',
    theme: '',
    style: '',
    subdomain: '',
    created_at: ''
  }

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
    <a href={getSubdomainUrl(poem.subdomain)} class="text-purple-600 hover:text-purple-800">Visit →</a>
  </div>
</div>



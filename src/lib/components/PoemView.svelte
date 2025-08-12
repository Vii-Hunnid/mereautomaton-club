<!-- src/lib/components/PoemView.svelte -->
<script>
  import { onMount } from 'svelte'
  export let poem
  let copied = false

  onMount(() => {
    if (poem && poem.id) {
      fetch(`/api/poems/${poem.id}/view`, { method: 'POST' }).catch((err) =>
        console.error('Failed to increment view count:', err)
      )
    }
  })

  async function sharePoem() {
    const poemUrl = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({ title: poem.title, text: poem.content, url: poemUrl })
      } catch (err) {
        console.error('Share failed:', err)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  async function copyToClipboard() {
    try {
      const poemUrl = typeof window !== 'undefined' ? window.location.href : ''
      const shareText = `${poem.title}\n\n${poem.content}\n\n— ${poemUrl}`
      await navigator.clipboard.writeText(shareText)
      copied = true
      setTimeout(() => {
        copied = false
      }, 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  /** @param {string} dateString */
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
  <section class="py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="flex justify-center gap-4 mb-8">
        {#if poem.style}
          <span class="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">{poem.style}</span>
        {/if}
        {#if poem.theme}
          <span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{poem.theme}</span>
        {/if}
      </div>

      <h1 class="text-4xl md:text-5xl font-bold font-serif mb-12 text-gray-800">{poem.title}</h1>

      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
        <div class="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed whitespace-pre-line">
          {poem.content}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 mb-8">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Created {formatDate(poem.created_at)}</span>
        </div>
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{poem.views || 0} views</span>
        </div>
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>AI Generated</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button on:click={sharePoem} class="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
          {#if copied}Copied! ✓{:else}Share Poem{/if}
        </button>
        <a href="/" class="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">Create Your Own</a>
      </div>
    </div>
  </section>
  <footer class="bg-white border-t py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-gray-600 mb-4">This poem was created using artificial intelligence at 
        <a href="/" class="text-purple-600 hover:text-purple-800 font-semibold">MereAutomaton.club</a>
      </p>
      <p class="text-sm text-gray-500">Create your own AI-generated poem and get a custom subdomain</p>
    </div>
  </footer>
</div>



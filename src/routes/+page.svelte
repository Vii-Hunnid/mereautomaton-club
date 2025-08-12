<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { generateSlug } from '$lib/utils/ai.js'
  
  export let data
  
  let poems = data.poems || []
  let newPoemTitle = ''
  let isGenerating = false
  
  async function createNewPoem() {
    if (!newPoemTitle.trim()) return
    
    isGenerating = true
    
    try {
      const slug = generateSlug(newPoemTitle)
      
      // Navigate to create page with the title
      await goto(`/create?title=${encodeURIComponent(newPoemTitle)}&slug=${slug}`)
    } catch (error) {
      console.error('Error creating poem:', error)
      alert('Failed to create poem. Please try again.')
    } finally {
      isGenerating = false
    }
  }
  
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      createNewPoem()
    }
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
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
  <title>MereAutomaton.club - AI Poetry Platform</title>
  <meta name="description" content="Create and discover beautiful AI-generated poetry with custom subdomains" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-5xl md:text-6xl font-bold font-serif mb-6">
      Where AI Meets Poetry
    </h1>
    <p class="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
      Create beautiful AI-generated poems with custom subdomains. 
      Give your poem a title, and watch as artificial intelligence crafts verses just for you.
    </p>
    
    <!-- Poem Title Input -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          bind:value={newPoemTitle}
          on:keypress={handleKeyPress}
          placeholder="Enter your poem title (e.g., 'Midnight Dreams')"
          class="flex-1 px-6 py-4 text-lg rounded-lg text-gray-800 border-0 focus:ring-4 focus:ring-white/30"
          disabled={isGenerating}
        />
        <button
          on:click={createNewPoem}
          disabled={!newPoemTitle.trim() || isGenerating}
          class="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isGenerating}
            Generating...
          {:else}
            Create Poem ✨
          {/if}
        </button>
      </div>
      <p class="text-sm mt-3 opacity-80">
        Your poem will be available at: <span class="font-mono">[title].mereautomaton.club</span>
      </p>
    </div>
  </div>
</section>

<!-- CTA Row: All Poems -->
<section class="py-10 bg-white">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <a href="/poems" class="inline-block bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
      See all poems →
    </a>
  </div>
  </section>

<!-- How to Prompt -->
<section class="py-16 bg-gray-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">How to prompt</h2>
    <div class="grid md:grid-cols-3 gap-6 text-gray-700">
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-semibold mb-2">Keep it evocative</h3>
        <p class="text-sm">Use strong imagery or emotions: "Midnight rain on empty streets".</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-semibold mb-2">Suggest a style</h3>
        <p class="text-sm">Add styles like "haiku", "free verse", or "sonnet".</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h3 class="font-semibold mb-2">Add a theme</h3>
        <p class="text-sm">Mention a theme: love, nature, technology, memory, time.</p>
      </div>
    </div>
  </div>
</section>



<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

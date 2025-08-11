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

<!-- Stats Section -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div>
        <div class="text-4xl font-bold text-purple-600 mb-2">{poems.length}</div>
        <div class="text-gray-600">Poems Created</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-blue-600 mb-2">∞</div>
        <div class="text-gray-600">Possibilities</div>
      </div>
      <div>
        <div class="text-4xl font-bold text-indigo-600 mb-2">AI</div>
        <div class="text-gray-600">Powered</div>
      </div>
    </div>
  </div>
</section>

<!-- Featured Poems -->
<section class="py-16 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Featured Poems</h2>
    
    {#if poems.length > 0}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each poems.slice(0, 6) as poem (poem.id)}
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="mb-4">
              <h3 class="text-xl font-semibold mb-2">
                <a 
                  href={getSubdomainUrl(poem.subdomain)}
                  class="text-purple-600 hover:text-purple-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {poem.title}
                </a>
              </h3>
              <div class="flex flex-wrap gap-2 mb-3">
                {#if poem.style}
                  <span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {poem.style}
                  </span>
                {/if}
                {#if poem.theme}
                  <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {poem.theme}
                  </span>
                {/if}
              </div>
            </div>
            
            <div class="font-serif text-gray-700 mb-4 text-center leading-relaxed">
              {poem.content.length > 150 
                ? poem.content.substring(0, 150) + '...'
                : poem.content
              }
            </div>
            
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>{formatDate(poem.created_at)}</span>
              <span>{poem.views || 0} views</span>
            </div>
            
            <div class="mt-4">
              <a 
                href={getSubdomainUrl(poem.subdomain)}
                class="text-purple-600 hover:text-purple-800 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit: {poem.subdomain}.mereautomaton.club →
              </a>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-12">
        <div class="text-gray-500 mb-4">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">No poems yet</h3>
        <p class="text-gray-600 mb-6">Be the first to create a beautiful AI-generated poem!</p>
        <button
          on:click={() => document.querySelector('input').focus()}
          class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Create the First Poem
        </button>
      </div>
    {/if}
  </div>
</section>

<!-- How It Works -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-purple-600">1</span>
        </div>
        <h3 class="text-xl font-semibold mb-3">Enter a Title</h3>
        <p class="text-gray-600">Give your poem a meaningful title that inspires the AI generation</p>
      </div>
      
      <div class="text-center">
        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-blue-600">2</span>
        </div>
        <h3 class="text-xl font-semibold mb-3">AI Generates</h3>
        <p class="text-gray-600">Our AI analyzes your title and creates a unique poem tailored to your theme</p>
      </div>
      
      <div class="text-center">
        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-indigo-600">3</span>
        </div>
        <h3 class="text-xl font-semibold mb-3">Get Your Domain</h3>
        <p class="text-gray-600">Your poem gets its own subdomain that you can share with the world</p>
      </div>
    </div>
  </div>
</section>



<!-- <h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->

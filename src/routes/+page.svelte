<!-- src/routes/+page.svelte -->
<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { generateSlug } from '$lib/utils/ai.js'
  import PoemCard from '$lib/components/PoemCard.svelte'
  
  export let data
  
  let poems = data.poems || []
  let newPoemTitle = ''
  let isGenerating = false
  let isMobile = false
  
  onMount(() => {
    // Check if mobile device
    isMobile = window.innerWidth < 768
    
    // Update on resize
    const handleResize = () => {
      isMobile = window.innerWidth < 768
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  
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
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-12 sm:py-16 lg:py-20 min-h-[90vh] flex items-center">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
    <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 leading-tight">
      Where AI Meets Poetry
    </h1>
    <p class="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 opacity-90 max-w-4xl mx-auto leading-relaxed px-2">
      Create beautiful AI-generated poems with custom subdomains. 
      Give your poem a title, and watch as artificial intelligence crafts verses just for you.
    </p>
    
    <!-- Enhanced Poem Title Input -->
    <div class="max-w-3xl mx-auto mb-8 sm:mb-12">
      <div class="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
        <!-- Input with better mobile styling and high contrast -->
        <div class="flex-1">
          <input
            bind:value={newPoemTitle}
            on:keypress={handleKeyPress}
            placeholder={isMobile ? "e.g., 'Midnight Dreams'" : "Enter your poem title (e.g., 'Midnight Dreams')"}
            class="w-full px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg rounded-xl text-gray-900 bg-white border-2 border-white/20 focus:border-white focus:ring-4 focus:ring-white/30 focus:outline-none shadow-xl placeholder-gray-500 transition-all duration-300 hover:shadow-2xl font-medium"
            disabled={isGenerating}
          />
        </div>
        
        <!-- Enhanced button with high contrast -->
        <button
          on:click={createNewPoem}
          disabled={!newPoemTitle.trim() || isGenerating}
          class="w-full sm:w-auto bg-white text-purple-700 px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 min-w-[160px] border-2 border-white/20 hover:border-white"
        >
          {#if isGenerating}
            <div class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </div>
          {:else}
            <div class="flex items-center justify-center">
              <span>Create Poem</span>
              <svg class="w-5 h-5 ml-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          {/if}
        </button>
      </div>
      
      <!-- Enhanced preview text with better contrast -->
      <div class="mt-4 sm:mt-6">
        <div class="bg-white/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-white/30">
          <p class="text-sm sm:text-base text-white font-medium">
            <span class="opacity-90">Your poem will be available at:</span>
          </p>
          <p class="font-mono text-blue-100 text-base sm:text-lg font-semibold mt-1">
            [title].mereautomaton.club
          </p>
        </div>
      </div>
    </div>
    
    <!-- Quick Start Tips - Mobile Optimized -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-0">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 mb-1 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <p class="text-xs sm:text-sm font-medium opacity-90">Be creative with your titles</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 mb-1 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p class="text-xs sm:text-sm font-medium opacity-90">AI generates in seconds</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-300 mb-1 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
        <p class="text-xs sm:text-sm font-medium opacity-90">Get your own subdomain</p>
      </div>
    </div>
  </div>
</section>

<!-- Recent Poems Section -->
{#if poems.length > 0}
  <section class="py-12 sm:py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Recent Poems</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {#each poems.slice(0, 6) as poem (poem.id)}
          <PoemCard {poem} />
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- CTA Section -->
<section class="py-8 sm:py-12 bg-gray-50">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <a 
      href="/poems" 
      class="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
    >
      <span>See all poems</span>
      <svg class="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
  </div>
</section>

<!-- How to Prompt Section -->
<section class="py-12 sm:py-16 bg-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">How to Create Great Poems</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-gray-700">
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        <h3 class="font-bold text-lg sm:text-xl mb-3 text-purple-800">Keep it evocative</h3>
        <p class="text-sm sm:text-base leading-relaxed">Use strong imagery or emotions: "Midnight rain on empty streets" or "Whispers of forgotten dreams".</p>
      </div>
      
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <h3 class="font-bold text-lg sm:text-xl mb-3 text-blue-800">Suggest a style</h3>
        <p class="text-sm sm:text-base leading-relaxed">Add styles like "haiku", "free verse", "sonnet", or "limerick" to guide the AI's creativity.</p>
      </div>
      
      <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="font-bold text-lg sm:text-xl mb-3 text-indigo-800">Add a theme</h3>
        <p class="text-sm sm:text-base leading-relaxed">Mention themes like love, nature, technology, memory, time, or adventure to set the mood.</p>
      </div>
    </div>
    
    <!-- Example Titles -->
    <div class="mt-12 sm:mt-16">
      <h3 class="text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8 text-gray-800">Example Titles That Work Great:</h3>
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {#each ["Digital Dreams Haiku", "Love in the Time of Rain", "Mountain Whispers", "Urban Solitude", "Ocean's Memory", "Starlight Sonnet"] as example}
          <span class="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer" on:click={() => newPoemTitle = example}>
            {example}
          </span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  /* Enhanced mobile-first responsive design */
  @media (max-width: 640px) {
    .min-h-\[90vh\] {
      min-height: 85vh;
    }
  }
  
  /* Improve button touch targets on mobile */
  button {
    min-height: 44px;
  }
  
  /* Better input styling on mobile */
  input {
    min-height: 56px;
  }
  
  /* Smooth scrolling for better UX */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom focus styles for better accessibility */
  input:focus,
  button:focus {
    outline: 2px solid rgba(168, 85, 247, 0.5);
    outline-offset: 2px;
  }
</style>

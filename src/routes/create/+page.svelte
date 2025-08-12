<!-- src/routes/create/+page.svelte -->
<script>
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { generatePoemPreferAI as generatePoem, generateSlug } from '$lib/utils/ai.js'
  import { createPoem, createSubdomain, checkSubdomainExists } from '$lib/utils/supabase.js'
  
  let title = ''
  let slug = ''
  let generatedPoem = null
  let isGenerating = false
  let isPublishing = false
  let error = null
  let success = false
  
  onMount(() => {
    // Get title and slug from URL params
    const urlTitle = $page.url.searchParams.get('title')
    const urlSlug = $page.url.searchParams.get('slug')
    
    if (urlTitle) {
      title = urlTitle
      slug = urlSlug || generateSlug(urlTitle)
    }
  })
  
  async function handleGeneratePoem() {
    if (!title.trim()) {
      error = 'Please enter a poem title'
      return
    }
    
    error = null
    isGenerating = true
    
    try {
      slug = generateSlug(title)
      generatedPoem = await generatePoem(title)
    } catch (err) {
      error = 'Failed to generate poem. Please try again.'
      console.error(err)
    } finally {
      isGenerating = false
    }
  }
  
  async function handlePublishPoem() {
    if (!generatedPoem || !title.trim()) {
      error = 'Please generate a poem first'
      return
    }
    
    error = null
    isPublishing = true
    
    try {
      // Check if subdomain already exists
      const subdomainExists = await checkSubdomainExists(slug)
      
      if (subdomainExists) {
        error = 'A poem with this title already exists. Please choose a different title.'
        isPublishing = false
        return
      }
      
      // Create subdomain entry
      await createSubdomain({
        subdomain: slug,
        title: title,
        description: `AI-generated poem: ${title}`
      })
      
      // Create poem entry
      const poemData = {
        title: title,
        content: generatedPoem.content,
        theme: generatedPoem.theme,
        style: generatedPoem.style,
        subdomain: slug,
        is_public: true
      }
      
      await createPoem(poemData)
      
      success = true
      
      // Redirect to the new poem's subdomain after a short delay
      setTimeout(() => {
        const protocol = window.location.protocol
        const domain = window.location.hostname.includes('localhost') 
          ? `localhost:${window.location.port}`
          : 'mereautomaton.club'
        window.location.href = `${protocol}//${slug}.${domain}`
      }, 2000)
      
    } catch (err) {
      error = 'Failed to publish poem. Please try again.'
      console.error(err)
    } finally {
      isPublishing = false
    }
  }
  
  function handleTitleChange() {
    slug = generateSlug(title)
    error = null
  }
  
  function getPreviewUrl() {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol
      const domain = window.location.hostname.includes('localhost') 
        ? `localhost:${window.location.port}`
        : 'mereautomaton.club'
      return `${protocol}//${slug}.${domain}`
    }
    return `https://${slug}.mereautomaton.club`
  }
</script>

<svelte:head>
  <title>Create Poem - MereAutomaton.club</title>
  <meta name="description" content="Create your own AI-generated poem with a custom subdomain" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold font-serif mb-4">Create Your AI Poem</h1>
    <p class="text-xl text-gray-600">Give your poem a title and let artificial intelligence craft beautiful verses</p>
  </div>
  
  <!-- Error/Success Messages -->
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700">{error}</p>
      </div>
    </div>
  {/if}
  
  {#if success}
    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-green-700">Poem published successfully! Redirecting to your poem...</p>
      </div>
    </div>
  {/if}
  
  <!-- Poem Creation Form -->
  <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
    <div class="space-y-6">
      <!-- Title Input -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Poem Title
        </label>
        <input
          id="title"
          bind:value={title}
          on:input={handleTitleChange}
          placeholder="Enter your poem title (e.g., 'Midnight Dreams', 'Ocean Whispers')"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          disabled={isGenerating || isPublishing}
        />
      </div>
      
      <!-- Subdomain Preview -->
      {#if slug}
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-1">Your poem will be available at:</p>
          <p class="font-mono text-purple-600 text-lg">{slug}.mereautomaton.club</p>
        </div>
      {/if}
      
      <!-- Generate Button -->
      <button
        on:click={handleGeneratePoem}
        disabled={!title.trim() || isGenerating || isPublishing}
        class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isGenerating}
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating poem...
          </div>
        {:else}
          Generate Poem ✨
        {/if}
      </button>
    </div>
  </div>
  
  <!-- Generated Poem Display -->
  {#if generatedPoem}
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h3 class="text-2xl font-semibold mb-6 text-center">Your Generated Poem</h3>
      
      <!-- Poem Metadata -->
      <div class="flex justify-center gap-4 mb-6">
        <span class="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
          {generatedPoem.style}
        </span>
        <span class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          {generatedPoem.theme}
        </span>
      </div>
      
      <!-- Poem Content -->
      <div class="max-w-2xl mx-auto">
        <h4 class="text-xl font-serif font-semibold text-center mb-4 text-gray-800">{title}</h4>
        <div class="font-serif text-lg text-gray-700 text-center leading-relaxed whitespace-pre-line mb-8">
          {generatedPoem.content}
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            on:click={handlePublishPoem}
            disabled={isPublishing || success}
            class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isPublishing}
              Publishing...
            {:else if success}
              Published! ✓
            {:else}
              Publish Poem
            {/if}
          </button>
          
          <button
            on:click={handleGeneratePoem}
            disabled={isGenerating || isPublishing || success}
            class="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate New Version
          </button>
        </div>
        
        {#if !success}
          <p class="text-sm text-gray-500 text-center mt-4">
            Once published, your poem will be available at: 
            <span class="font-mono text-purple-600">{getPreviewUrl()}</span>
          </p>
        {/if}
      </div>
    </div>
  {/if}
</div>

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
  let showAdvanced = false
  
  // Advanced options
  let selectedStyle = 'any'
  let selectedTone = 'any'
  let selectedEmotion = 'any'
  let selectedTheme = 'any'
  let poemLength = 'medium'
  let customPrompt = ''
  
  // Style options
  const styles = [
    { value: 'any', label: 'Any Style', description: 'Let AI choose' },
    { value: 'haiku', label: 'Haiku', description: '3 lines, 5-7-5 syllables' },
    { value: 'sonnet', label: 'Sonnet', description: '14 lines with rhyme scheme' },
    { value: 'free-verse', label: 'Free Verse', description: 'No fixed structure' },
    { value: 'limerick', label: 'Limerick', description: 'Humorous 5-line poem' },
    { value: 'acrostic', label: 'Acrostic', description: 'First letters spell a word' },
    { value: 'ballad', label: 'Ballad', description: 'Narrative poem with rhythm' }
  ]
  
  // Tone options
  const tones = [
    { value: 'any', label: 'Any Tone' },
    { value: 'playful', label: 'Playful' },
    { value: 'serious', label: 'Serious' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'whimsical', label: 'Whimsical' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'conversational', label: 'Conversational' }
  ]
  
  // Emotion options
  const emotions = [
    { value: 'any', label: 'Any Emotion' },
    { value: 'joyful', label: 'Joyful' },
    { value: 'melancholic', label: 'Melancholic' },
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'passionate', label: 'Passionate' },
    { value: 'nostalgic', label: 'Nostalgic' },
    { value: 'hopeful', label: 'Hopeful' },
    { value: 'contemplative', label: 'Contemplative' },
    { value: 'energetic', label: 'Energetic' }
  ]
  
  // Theme options
  const themes = [
    { value: 'any', label: 'Any Theme' },
    { value: 'nature', label: 'Nature' },
    { value: 'love', label: 'Love & Romance' },
    { value: 'technology', label: 'Technology' },
    { value: 'time', label: 'Time & Memory' },
    { value: 'dreams', label: 'Dreams & Fantasy' },
    { value: 'seasons', label: 'Seasons' },
    { value: 'city-life', label: 'City Life' },
    { value: 'friendship', label: 'Friendship' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'wisdom', label: 'Wisdom & Philosophy' }
  ]
  
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
      
      // Build enhanced prompt with options
      let enhancedTitle = title
      
      if (showAdvanced) {
        const options = []
        if (selectedStyle !== 'any') options.push(`style: ${selectedStyle}`)
        if (selectedTone !== 'any') options.push(`tone: ${selectedTone}`)
        if (selectedEmotion !== 'any') options.push(`emotion: ${selectedEmotion}`)
        if (selectedTheme !== 'any') options.push(`theme: ${selectedTheme}`)
        if (poemLength !== 'medium') options.push(`length: ${poemLength}`)
        if (customPrompt.trim()) options.push(`additional: ${customPrompt}`)
        
        if (options.length > 0) {
          enhancedTitle = `${title} (${options.join(', ')})`
        }
      }
      
      generatedPoem = await generatePoem(enhancedTitle)
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
  
  function resetAdvancedOptions() {
    selectedStyle = 'any'
    selectedTone = 'any'
    selectedEmotion = 'any'
    selectedTheme = 'any'
    poemLength = 'medium'
    customPrompt = ''
  }
</script>

<svelte:head>
  <title>Create Poem - MereAutomaton.club</title>
  <meta name="description" content="Create your own AI-generated poem with advanced customization options" />
</svelte:head>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
  <!-- Header -->
  <div class="text-center mb-8 sm:mb-12">
    <h1 class="text-3xl sm:text-4xl font-bold font-serif mb-4 text-gray-800">Create Your AI Poem</h1>
    <p class="text-lg sm:text-xl text-gray-600">Give your poem a title and customize the style, tone, and emotion</p>
  </div>
  
  <!-- Error/Success Messages -->
  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 font-medium">{error}</p>
      </div>
    </div>
  {/if}
  
  {#if success}
    <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
      <div class="flex">
        <svg class="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-green-700 font-medium">Poem published successfully! Redirecting to your poem...</p>
      </div>
    </div>
  {/if}
  
  <!-- Main Creation Form -->
  <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
    <div class="p-6 sm:p-8">
      <!-- Title Input -->
      <div class="mb-6">
        <label for="title" class="block text-sm font-semibold text-gray-700 mb-3">
          Poem Title
        </label>
        <input
          id="title"
          bind:value={title}
          on:input={handleTitleChange}
          placeholder="Enter your poem title (e.g., 'Midnight Dreams', 'Ocean Whispers')"
          class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-medium transition-all duration-200 hover:border-gray-300"
          disabled={isGenerating || isPublishing}
        />
      </div>
      
      <!-- Subdomain Preview -->
      {#if slug}
        <div class="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
            <p class="text-sm text-purple-700 font-medium">Your poem will be available at:</p>
          </div>
          <p class="font-mono text-purple-800 text-lg font-bold mt-1">{slug}.mereautomaton.club</p>
        </div>
      {/if}
      
      <!-- Advanced Options Toggle -->
      <div class="mb-6">
        <button
          type="button"
          on:click={() => showAdvanced = !showAdvanced}
          class="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span class="font-semibold text-gray-700">Advanced Options</span>
            <span class="text-sm text-gray-500 ml-2">(Optional - customize style, tone & emotion)</span>
          </div>
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform duration-200 {showAdvanced ? 'rotate-180' : ''}" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <!-- Advanced Options Panel -->
        {#if showAdvanced}
          <div class="mt-4 p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
            <!-- Style and Length -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Poetry Style</label>
                <select bind:value={selectedStyle} class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  {#each styles as style}
                    <option value={style.value}>{style.label}</option>
                  {/each}
                </select>
                {#if selectedStyle !== 'any'}
                  <p class="text-xs text-gray-500 mt-1">{styles.find(s => s.value === selectedStyle)?.description}</p>
                {/if}
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Poem Length</label>
                <select bind:value={poemLength} class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="short">Short (4-8 lines)</option>
                  <option value="medium">Medium (8-16 lines)</option>
                  <option value="long">Long (16+ lines)</option>
                </select>
              </div>
            </div>
            
            <!-- Tone and Emotion -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Tone</label>
                <select bind:value={selectedTone} class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  {#each tones as tone}
                    <option value={tone.value}>{tone.label}</option>
                  {/each}
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Emotion</label>
                <select bind:value={selectedEmotion} class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  {#each emotions as emotion}
                    <option value={emotion.value}>{emotion.label}</option>
                  {/each}
                </select>
              </div>
            </div>
            
            <!-- Theme -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
              <select bind:value={selectedTheme} class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                {#each themes as theme}
                  <option value={theme.value}>{theme.label}</option>
                {/each}
              </select>
            </div>
            
            <!-- Custom Prompt -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">Additional Instructions</label>
              <textarea
                bind:value={customPrompt}
                placeholder="Add any specific requests (e.g., 'include imagery of stars', 'use metaphors about journeys', 'mention specific colors')"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-20 resize-none"
                disabled={isGenerating || isPublishing}
              ></textarea>
            </div>
            
            <!-- Reset Button -->
            <div class="flex justify-end">
              <button
                type="button"
                on:click={resetAdvancedOptions}
                class="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Reset to defaults
              </button>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- Generate Button -->
      <button
        on:click={handleGeneratePoem}
        disabled={!title.trim() || isGenerating || isPublishing}
        class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {#if isGenerating}
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating your poem...
          </div>
        {:else}
          <div class="flex items-center justify-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Generate Poem
          </div>
        {/if}
      </button>
    </div>
  </div>
  
  <!-- Generated Poem Display -->
  {#if generatedPoem}
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
      <div class="text-center mb-8">
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Your Generated Poem</h3>
        <p class="text-gray-600">AI has crafted something beautiful for you</p>
      </div>
      
      <!-- Poem Metadata -->
      <div class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
        <span class="inline-block bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full border border-purple-200">
          {generatedPoem.style}
        </span>
        <span class="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200">
          {generatedPoem.theme}
        </span>
        {#if showAdvanced && selectedTone !== 'any'}
          <span class="inline-block bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm font-semibold px-4 py-2 rounded-full border border-green-200">
            {selectedTone}
          </span>
        {/if}
        {#if showAdvanced && selectedEmotion !== 'any'}
          <span class="inline-block bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full border border-yellow-200">
            {selectedEmotion}
          </span>
        {/if}
      </div>
      
      <!-- Poem Content -->
      <div class="max-w-3xl mx-auto">
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200">
          <h4 class="text-2xl sm:text-3xl font-serif font-bold text-center mb-6 text-gray-800">{title}</h4>
          <div class="font-serif text-lg sm:text-xl text-gray-700 text-center leading-relaxed whitespace-pre-line">
            {generatedPoem.content}
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            on:click={handlePublishPoem}
            disabled={isPublishing || success}
            class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {#if isPublishing}
              <div class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </div>
            {:else if success}
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Published!
              </div>
            {:else}
              <div class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publish Poem
              </div>
            {/if}
          </button>
          
          <button
            on:click={handleGeneratePoem}
            disabled={isGenerating || isPublishing || success}
            class="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate New Version
            </div>
          </button>
        </div>
        
        {#if !success}
          <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p class="text-sm text-blue-700 text-center">
              <span class="font-medium">Once published, your poem will be available at:</span><br>
              <span class="font-mono text-blue-800 font-bold">{getPreviewUrl()}</span>
            </p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Smooth transitions */
  select, input, textarea, button {
    transition: all 0.2s ease;
  }
  
  /* Custom scrollbar for textarea */
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  
  textarea::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  textarea::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  textarea::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
</style>

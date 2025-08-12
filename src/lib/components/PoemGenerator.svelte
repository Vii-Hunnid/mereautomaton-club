<!-- src/lib/components/PoemGenerator.svelte -->
<script>
  import { generateSlug, generatePoemPreferAI } from '$lib/utils/ai.js'
  export let onGenerated = (poem) => {}

  let title = ''
  let slug = ''
  let isGenerating = false
  let error = ''

  function handleTitleChange() {
    slug = generateSlug(title)
    error = ''
  }

  async function handleGenerate() {
    if (!title.trim()) {
      error = 'Please enter a poem title'
      return
    }
    isGenerating = true
    error = ''
    try {
      const generated = await generatePoemPreferAI(title)
      onGenerated({ title, slug, ...generated })
    } catch (e) {
      error = 'Failed to generate poem. Please try again.'
      console.error(e)
    } finally {
      isGenerating = false
    }
  }
</script>

<div class="space-y-4">
  <div>
    <input
      bind:value={title}
      on:input={handleTitleChange}
      placeholder="Enter your poem title"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      disabled={isGenerating}
    />
    {#if slug}
      <p class="text-xs text-gray-500 mt-1">subdomain: <span class="font-mono text-purple-600">{slug}.mereautomaton.club</span></p>
    {/if}
  </div>

  <button
    on:click={handleGenerate}
    disabled={!title.trim() || isGenerating}
    class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if isGenerating}
      Generating...
    {:else}
      Generate Poem
    {/if}
  </button>

  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {/if}
</div>



<!-- src/routes/[subdomain]/+page.svelte -->
<script>
  import { page } from '$app/stores'
  import PoemView from '$lib/components/PoemView.svelte'
  export let data
  let poem = data.poem
</script>

<svelte:head>
  {#if poem}
    <title>{poem.title} - MereAutomaton.club</title>
    <meta name="description" content="AI-generated poem: {poem.title}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content={poem.title} />
    <meta property="og:description" content="AI-generated poem: {poem.title}" />
    <meta property="og:url" content={$page.url.href} />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={poem.title} />
    <meta name="twitter:description" content="AI-generated poem: {poem.title}" />
  {:else}
    <title>Poem Not Found - MereAutomaton.club</title>
  {/if}
</svelte:head>

{#if poem}
  <PoemView {poem} />
{:else}
  <!-- Poem Not Found -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md mx-auto text-center px-4">
      <div class="mb-8">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-8-7.109V3a3 3 0 013-3h6a3 3 0 013 3v10.291z" />
        </svg>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Poem Not Found</h1>
      <p class="text-gray-600 mb-8">
        The poem you're looking for doesn't exist or has been removed.
      </p>
      
      <div class="space-y-4">
        <a
          href="/"
          class="block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Go to Homepage
        </a>
        
        <a
          href="/create"
          class="block bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
        >
          Create a New Poem
        </a>
      </div>
    </div>
  </div>
{/if}

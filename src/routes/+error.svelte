<!-- src/routes/+error.svelte -->
<script>
    import { page } from '$app/stores'
    
    $: errorCode = $page.status
    $: errorMessage = $page.error?.message || 'Page not found'
    
    // Check if we're on a subdomain
    $: isSubdomain = typeof window !== 'undefined' && 
      $page.url.host !== 'mereautomaton.club' && 
      $page.url.host !== 'www.mereautomaton.club' &&
      !$page.url.host.includes('localhost') &&
      !$page.url.host.includes('vercel.app')
      
    $: subdomain = isSubdomain ? $page.url.host.split('.')[0] : null
  </script>
  
  <svelte:head>
    <title>{errorCode} - {errorMessage}</title>
  </svelte:head>
  
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
    <div class="max-w-2xl mx-auto text-center px-4">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.4a7.962 7.962 0 01-8-7.109V3a3 3 0 013-3h6a3 3 0 013 3v10.291z" />
          </svg>
        </div>
        <h1 class="text-6xl font-bold text-gray-800 mb-4">{errorCode}</h1>
      </div>
      
      <!-- Error Message -->
      {#if errorCode === 404}
        {#if isSubdomain && subdomain}
          <!-- Subdomain-specific 404 -->
          <h2 class="text-3xl font-bold font-serif text-gray-800 mb-6">Poem Not Found</h2>
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <p class="text-lg text-gray-600 mb-6">
              The poem "{subdomain}" doesn't exist or has been removed.
            </p>
            <div class="flex items-center justify-center gap-2 text-purple-600 mb-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-mono text-sm">{subdomain}.mereautomaton.club</span>
            </div>
          </div>
        {:else}
          <!-- General 404 -->
          <h2 class="text-3xl font-bold font-serif text-gray-800 mb-6">Page Not Found</h2>
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <p class="text-lg text-gray-600 mb-4">
              The page you're looking for doesn't exist.
            </p>
          </div>
        {/if}
      {:else}
        <!-- Other error codes -->
        <h2 class="text-3xl font-bold font-serif text-gray-800 mb-6">Oops! Something went wrong</h2>
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p class="text-lg text-gray-600 mb-4">{errorMessage}</p>
        </div>
      {/if}
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/"
          class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go to Homepage
        </a>
        
        <a
          href="/create"
          class="inline-flex items-center justify-center gap-2 bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create a New Poem
        </a>
        
        <a
          href="/poems"
          class="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Browse All Poems
        </a>
      </div>
      
      <!-- Help Text -->
      <div class="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl">
        <h3 class="font-semibold text-gray-800 mb-3">Looking for something specific?</h3>
        <div class="text-sm text-gray-600 space-y-2">
          <p>• Each poem has its own unique subdomain (e.g., <span class="font-mono">dreamscape.mereautomaton.club</span>)</p>
          <p>• You can create your own AI-generated poem with a custom subdomain</p>
          <p>• Browse existing poems to discover amazing AI-created verses</p>
        </div>
      </div>
    </div>
  </div>

  
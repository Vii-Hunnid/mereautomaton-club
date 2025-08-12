<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'
  import { page } from '$app/stores'
  
  export let data: { sponsor: any };

  $: isSubdomain = typeof window !== 'undefined' && 
    $page.url.host !== 'mereautomaton.club' && 
    $page.url.host !== 'www.mereautomaton.club' &&
    !$page.url.host.includes('localhost') &&
    !$page.url.host.includes('vercel.app')
</script>

<svelte:head>
  <title>{isSubdomain ? ($page.params.subdomain || 'Poem') + ' - MereAutomaton.club' : 'MereAutomaton.club - AI Poetry Platform'}</title>
  <meta name="description" content="Create and discover beautiful AI-generated poetry" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Enhanced Navigation -->
  <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14 sm:h-16">
        <div class="flex items-center space-x-2 sm:space-x-4">
          <a href="/" class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MereAutomaton.club
          </a>
          <span class="text-xs sm:text-sm text-gray-500 hidden sm:block">AI Poetry Platform</span>
        </div>
        
        {#if !isSubdomain}
          <div class="flex items-center space-x-2 sm:space-x-4">
            <a href="/poems" class="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
              All Poems
            </a>
            <a href="/create" class="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base font-medium">
              Create Poem
            </a>
          </div>
        {:else}
          <div class="flex items-center space-x-2 sm:space-x-4">
            <a href="https://www.mereautomaton.club/" class="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base">
              ← Back to Home
            </a>
          </div>
        {/if}
      </div>
    </div>
  </nav>

  {#if data.sponsor}
    <a
      class="block mx-auto my-6 max-w-3xl rounded-2xl border p-4 no-underline"
      href={`/sponsor/click?slot=${data.sponsor.id}`}
    >
      <span class="text-xs opacity-60">Sponsored</span>
      <h4 class="text-lg font-semibold">{data.sponsor.headline}</h4>
      <p class="text-sm">{data.sponsor.body}</p>
    </a>
  {/if}

  <!-- Main Content -->
  <main>
    <slot />
  </main>

  <!-- Enhanced Footer with Twitter Handle -->
  {#if !isSubdomain}
    <footer class="bg-gray-800 text-white py-12 sm:py-16 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12">
          <!-- X/Twitter Handle - Featured prominently at the top -->
          <div class="flex justify-center mb-8">
            <a 
              href="https://x.com/Viihunnid" 
              target="_blank"
              rel="noopener noreferrer"
              class="group relative inline-flex items-center text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-medium text-sm sm:text-base border bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-gray-600 hover:border-gray-500"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-3 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span class="hidden sm:inline mr-1">Follow me on</span>
              <span class="sm:hidden mr-1">Follow</span>
              <span class="font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">@Viihunnid</span>
              
              <!-- Subtle shine effect on hover -->
              <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 transition-opacity duration-500"></div>
            </a>
          </div>
          
          <!-- Main Footer Content -->
          <div class="mb-8">
            <h4 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              MereAutomaton.club
            </h4>
            <p class="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Bridging the gap between artificial intelligence and human creativity through poetry. 
              Create, share, and discover beautiful AI-generated verses with custom subdomains.
            </p>
          </div>
          
          <!-- Feature Highlights -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h5 class="font-semibold text-sm sm:text-base mb-2">AI-Powered</h5>
              <p class="text-gray-400 text-xs sm:text-sm text-center">Advanced AI creates unique poems</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h5 class="font-semibold text-sm sm:text-base mb-2">Custom Subdomains</h5>
              <p class="text-gray-400 text-xs sm:text-sm text-center">Your own unique poetry URL</p>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h5 class="font-semibold text-sm sm:text-base mb-2">Easy Sharing</h5>
              <p class="text-gray-400 text-xs sm:text-sm text-center">Share your poems with the world</p>
            </div>
          </div>
        </div>
        
        <!-- Bottom Border and Copyright -->
        <div class="border-t border-gray-700 pt-6 sm:pt-8 text-center">
          <div class="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2025 MereAutomaton.club</p>
            <span class="hidden sm:block">•</span>
            <p>Powered by AI, inspired by humanity</p>
            <span class="hidden sm:block">•</span>
            <div class="flex items-center">
              <span class="mr-1">Made with</span>
              <svg class="w-4 h-4 text-red-400 mx-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="ml-1">for poets everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  {/if}
</div>

<style>
  /* Smooth transitions */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  /* Better mobile touch targets */
  @media (max-width: 640px) {
    nav a, nav button {
      min-height: 44px;
      display: flex;
      align-items: center;
    }
  }
  
  /* Sticky nav shadow on scroll */
  nav {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.95);
  }
</style>

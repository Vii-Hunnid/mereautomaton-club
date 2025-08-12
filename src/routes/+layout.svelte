<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'
  import { page } from '$app/stores'
  
  $: isSubdomain = typeof window !== 'undefined' && 
    $page.url.host !== 'mereautomaton.club' && 
    $page.url.host !== 'www.mereautomaton.club' &&
    !$page.url.host.includes('localhost') &&
    !$page.url.host.includes('vercel.app')
</script>

<svelte:head>
  <title>{isSubdomain ? ($page.params.subdomain || 'Poem') + ' - MereAutomaton.club' : 'MereAutomaton.club - AI Poetry Platform'}</title>
  <meta name="description" content="Create and discover beautiful AI-generated poetry" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <a href="/" class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MereAutomaton.club
          </a>
          <span class="text-sm text-gray-500 hidden sm:block">AI Poetry Platform</span>
        </div>
        
        {#if !isSubdomain}
          <div class="flex items-center space-x-4">
            <a href="/poems" class="text-gray-600 hover:text-purple-600 transition-colors">
              All Poems
            </a>
            <a href="/create" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Create Poem
            </a>
          </div>
        {:else}
          <div class="flex items-center space-x-4">
            <a href="https://www.mereautomaton.club/" class="text-gray-600 hover:text-purple-600 transition-colors">
              ← Back to Home
            </a>
          </div>
        {/if}
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main>
    <slot />
  </main>

  <!-- Footer -->
  {#if !isSubdomain}
    <footer class="bg-gray-800 text-white py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mt-8">
          <div>
            <h4 class="text-lg font-semibold mb-4">MereAutomaton.club</h4>
            <p class="text-gray-400">Bridging the gap between artificial intelligence and human creativity through poetry.</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MereAutomaton.club. Powered by AI, inspired by humanity.</p>
        </div>
      </div>
    </footer>
  {/if}
</div>

<!-- src/lib/components/Navigation.svelte -->
<script>
  export let showBrand = true
  export let className = ''
</script>

<nav class={`bg-white shadow-sm border-b ${className}`}>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <div class="flex items-center space-x-4">
        {#if showBrand}
          <a href="/" class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MereAutomaton.club
          </a>
          <span class="text-sm text-gray-500 hidden sm:block">AI Poetry Platform</span>
        {/if}
      </div>

      <div class="flex items-center space-x-4">
        <a href="/poems" class="text-gray-600 hover:text-purple-600 transition-colors">All Poems</a>
        <a href="/create" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Create Poem</a>
      </div>
    </div>
  </div>
  </nav>



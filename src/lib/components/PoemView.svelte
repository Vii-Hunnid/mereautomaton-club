<!-- src/lib/components/PoemView.svelte -->
<script>
  import { onMount } from 'svelte'
  import { Camera, Share2, Copy, Download } from 'lucide-svelte'
  
  export let poem
  let copied = false
  let urlCopied = false
  let isCapturing = false
  let poemElement

  onMount(() => {
    if (poem && poem.id) {
      console.log('Incrementing view for poem:', poem.id)
      fetch(`/api/poems/${poem.id}/view`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        if (data.success) {
          console.log('View count incremented successfully')
        } else {
          console.error('Failed to increment view count:', data.error)
        }
      })
      .catch((err) => {
        console.error('Failed to increment view count:', err)
      })
    } else {
      console.warn('No poem ID available for view counting')
    }
  })

  async function downloadScreenshot() {
    if (!poem) return
    
    isCapturing = true
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size (Instagram post size)
      const width = 1080
      const height = 1080
      canvas.width = width
      canvas.height = height
      
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#faf5ff') // purple-50
      gradient.addColorStop(0.5, '#eff6ff') // blue-50
      gradient.addColorStop(1, '#eef2ff') // indigo-50
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      // Add subtle decorative circles
      ctx.globalAlpha = 0.1
      ctx.fillStyle = '#8b5cf6' // purple-500
      ctx.beginPath()
      ctx.arc(200, 200, 120, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = '#3b82f6' // blue-500
      ctx.beginPath()
      ctx.arc(width - 150, height - 150, 80, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.globalAlpha = 1
      
      // Set up text styles
      ctx.textAlign = 'center'
      ctx.fillStyle = '#1f2937' // gray-800
      
      // Draw title
      ctx.font = 'bold 44px "Playfair Display", serif'
      const titleLines = wrapText(ctx, poem.title, width - 160, 60)
      let yPosition = 120
      
      titleLines.forEach(line => {
        ctx.fillText(line, width / 2, yPosition)
        yPosition += 60
      })
      
      yPosition += 30
      
      // Draw tags
      if (poem.style || poem.theme) {
        ctx.font = '18px "Inter", sans-serif'
        ctx.fillStyle = '#6b7280' // gray-500
        
        const tags = []
        if (poem.style) tags.push(poem.style)
        if (poem.theme) tags.push(poem.theme)
        
        ctx.fillText(tags.join(' • '), width / 2, yPosition)
        yPosition += 50
      }
      
      // Format and draw poem content based on style
      const formattedContent = formatPoemForDisplay(poem.content, poem.style)
      drawFormattedPoem(ctx, formattedContent, width, yPosition, poem.style)
      
      // Add attribution at bottom
      yPosition = height - 120
      ctx.font = '24px "Inter", sans-serif'
      ctx.fillStyle = '#8b5cf6' // purple-500
      ctx.fillText('MereAutomaton.club', width / 2, yPosition)
      
      ctx.font = '18px "Inter", sans-serif'
      ctx.fillStyle = '#9ca3af' // gray-400
      ctx.fillText('AI-Generated Poetry', width / 2, yPosition + 35)
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${poem.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}-poem.png`
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }, 'image/png', 0.95)
      
    } catch (err) {
      console.error('Screenshot failed:', err)
      alert('Failed to create image. Please try again or take a manual screenshot.')
    } finally {
      isCapturing = false
    }
  }

  // Enhanced text wrapping function
  function wrapText(ctx, text, maxWidth, lineHeight) {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0] || ''

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine + ' ' + word
      const width = ctx.measureText(testLine).width
      if (width < maxWidth) {
        currentLine = testLine
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }
    return lines
  }

  // Format poem content based on poetry style
  function formatPoemForDisplay(content, style) {
    const lines = content.split('\n').filter(line => line.trim())
    const styleType = (style || '').toLowerCase()
    
    return {
      lines,
      styleType,
      formatting: getPoemFormatting(styleType)
    }
  }

  // Get formatting rules for different poetry styles
  function getPoemFormatting(styleType) {
    const formats = {
      'haiku': {
        lineSpacing: 45,
        fontSize: 32,
        alignment: 'center',
        stanzaBreak: 15,
        maxWidth: 600
      },
      'sonnet': {
        lineSpacing: 35,
        fontSize: 26,
        alignment: 'center',
        stanzaBreak: 20,
        maxWidth: 700,
        stanzaPattern: [4, 4, 4, 2] // Traditional sonnet structure
      },
      'limerick': {
        lineSpacing: 38,
        fontSize: 28,
        alignment: 'center',
        stanzaBreak: 15,
        maxWidth: 650,
        indentPattern: [0, 20, 20, 20, 0] // AABBA rhyme scheme indentation
      },
      'ballad': {
        lineSpacing: 32,
        fontSize: 28,
        alignment: 'center',
        stanzaBreak: 25,
        maxWidth: 750,
        stanzaPattern: [4] // 4-line stanzas
      },
      'acrostic': {
        lineSpacing: 35,
        fontSize: 28,
        alignment: 'left',
        stanzaBreak: 10,
        maxWidth: 700,
        highlightFirstLetter: true
      },
      'free verse': {
        lineSpacing: 38,
        fontSize: 30,
        alignment: 'center',
        stanzaBreak: 20,
        maxWidth: 800,
        preserveSpacing: true
      }
    }
    
    return formats[styleType] || formats['free verse']
  }

  // Draw formatted poem with proper structure
  function drawFormattedPoem(ctx, formattedContent, canvasWidth, startY, style) {
    const { lines, styleType, formatting } = formattedContent
    const { lineSpacing, fontSize, alignment, stanzaBreak, maxWidth, stanzaPattern, indentPattern, highlightFirstLetter } = formatting
    
    ctx.font = `${fontSize}px "Playfair Display", serif`
    ctx.fillStyle = '#374151' // gray-700
    
    let yPosition = startY
    let lineIndex = 0
    let stanzaLineCount = 0
    let currentStanzaIndex = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) {
        // Empty line - add stanza break
        yPosition += stanzaBreak
        stanzaLineCount = 0
        continue
      }
      
      // Calculate indentation for specific styles
      let indent = 0
      if (indentPattern && lineIndex < indentPattern.length) {
        indent = indentPattern[lineIndex % indentPattern.length]
      }
      
      // Handle text alignment and positioning
      let xPosition = canvasWidth / 2
      if (alignment === 'left') {
        ctx.textAlign = 'left'
        xPosition = (canvasWidth - maxWidth) / 2 + indent
      } else {
        ctx.textAlign = 'center'
        xPosition = canvasWidth / 2 + indent
      }
      
      // Special handling for acrostic - highlight first letter
      if (highlightFirstLetter && line.length > 0) {
        const firstLetter = line[0]
        const restOfLine = line.substring(1)
        
        // Draw first letter in bold/colored
        ctx.font = `bold ${fontSize}px "Playfair Display", serif`
        ctx.fillStyle = '#8b5cf6' // purple-500
        
        if (alignment === 'left') {
          ctx.fillText(firstLetter, xPosition, yPosition)
          const letterWidth = ctx.measureText(firstLetter).width
          
          // Draw rest of line
          ctx.font = `${fontSize}px "Playfair Display", serif`
          ctx.fillStyle = '#374151' // gray-700
          ctx.fillText(restOfLine, xPosition + letterWidth, yPosition)
        } else {
          // For center alignment, we need to calculate total width
          ctx.font = `${fontSize}px "Playfair Display", serif`
          const totalWidth = ctx.measureText(line).width
          const startX = xPosition - totalWidth / 2
          
          ctx.font = `bold ${fontSize}px "Playfair Display", serif`
          ctx.fillStyle = '#8b5cf6'
          ctx.fillText(firstLetter, startX, yPosition)
          
          const letterWidth = ctx.measureText(firstLetter).width
          ctx.font = `${fontSize}px "Playfair Display", serif`
          ctx.fillStyle = '#374151'
          ctx.fillText(restOfLine, startX + letterWidth, yPosition)
        }
      } else {
        // Normal line drawing
        ctx.font = `${fontSize}px "Playfair Display", serif`
        ctx.fillStyle = '#374151'
        
        // Handle long lines by wrapping them
        const wrappedLines = wrapText(ctx, line, maxWidth, lineSpacing)
        for (const wrappedLine of wrappedLines) {
          ctx.fillText(wrappedLine, xPosition, yPosition)
          yPosition += lineSpacing
        }
        yPosition -= lineSpacing // Adjust because we'll add it back below
      }
      
      yPosition += lineSpacing
      stanzaLineCount++
      lineIndex++
      
      // Add stanza breaks based on pattern
      if (stanzaPattern && stanzaLineCount >= stanzaPattern[currentStanzaIndex % stanzaPattern.length]) {
        yPosition += stanzaBreak
        stanzaLineCount = 0
        currentStanzaIndex++
      }
      
      // Prevent overflow
      if (yPosition > 900) break
    }
  }

  async function sharePoem() {
    const poemUrl = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: poem.title, 
          text: `Check out this AI-generated poem: "${poem.title}"`, 
          url: poemUrl 
        })
      } catch (err) {
        console.error('Share failed:', err)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  async function copyToClipboard() {
    try {
      const poemUrl = typeof window !== 'undefined' ? window.location.href : ''
      const shareText = `${poem.title}\n\n${poem.content}\n\n— ${poemUrl}`
      await navigator.clipboard.writeText(shareText)
      copied = true
      setTimeout(() => {
        copied = false
      }, 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  async function copyUrl() {
    try {
      // Generate the proper subdomain URL
      const host = `${poem.subdomain}.mereautomaton.club`
      const poemUrl = `https://${host}/`
      await navigator.clipboard.writeText(poemUrl)
      urlCopied = true
      setTimeout(() => {
        urlCopied = false
      }, 2000)
    } catch (err) {
      console.error('Copy URL failed:', err)
    }
  }

  /** @param {string} dateString */
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format poem content for HTML display based on poetry style
   */
  function formatPoemHTML(content, style) {
    const lines = content.split('\n').filter(line => line.trim())
    const styleType = (style || '').toLowerCase()
    
    // Apply specific formatting based on poetry style
    switch (styleType) {
      case 'haiku':
        return formatHaiku(lines)
      case 'sonnet':
        return formatSonnet(lines)
      case 'limerick':
        return formatLimerick(lines)
      case 'acrostic':
        return formatAcrostic(lines)
      case 'ballad':
        return formatBallad(lines)
      default:
        return formatFreeVerse(lines)
    }
  }

  function formatHaiku(lines) {
    return `<div class="text-center space-y-2">${lines.map(line => 
      `<div class="text-2xl leading-relaxed">${line.trim()}</div>`
    ).join('')}</div>`
  }

  function formatSonnet(lines) {
    // Traditional sonnet: 3 quatrains + 1 couplet
    let html = '<div class="text-center space-y-6">'
    let lineIndex = 0
    
    // First three quatrains (4 lines each)
    for (let q = 0; q < 3 && lineIndex < lines.length; q++) {
      html += '<div class="space-y-1">'
      for (let i = 0; i < 4 && lineIndex < lines.length; i++) {
        html += `<div class="leading-relaxed">${lines[lineIndex].trim()}</div>`
        lineIndex++
      }
      html += '</div>'
    }
    
    // Final couplet
    if (lineIndex < lines.length) {
      html += '<div class="space-y-1 mt-4">'
      while (lineIndex < lines.length) {
        html += `<div class="leading-relaxed font-semibold">${lines[lineIndex].trim()}</div>`
        lineIndex++
      }
      html += '</div>'
    }
    
    html += '</div>'
    return html
  }

  function formatLimerick(lines) {
    // AABBA rhyme scheme with specific indentation
    const indentPattern = ['', 'ml-4', 'ml-4', 'ml-4', '']
    
    return `<div class="text-center space-y-2">${lines.map((line, index) => 
      `<div class="leading-relaxed ${indentPattern[index % indentPattern.length]}">${line.trim()}</div>`
    ).join('')}</div>`
  }

  function formatAcrostic(lines) {
    return `<div class="text-left space-y-2 max-w-2xl mx-auto">${lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.length > 0) {
        const firstLetter = trimmed[0]
        const rest = trimmed.substring(1)
        return `<div class="leading-relaxed">
          <span class="text-purple-600 font-bold text-3xl">${firstLetter}</span><span class="text-2xl">${rest}</span>
        </div>`
      }
      return `<div class="leading-relaxed">${trimmed}</div>`
    }).join('')}</div>`
  }

  function formatBallad(lines) {
    // Group into 4-line stanzas
    let html = '<div class="text-center space-y-6">'
    for (let i = 0; i < lines.length; i += 4) {
      html += '<div class="space-y-1">'
      for (let j = 0; j < 4 && i + j < lines.length; j++) {
        html += `<div class="leading-relaxed">${lines[i + j].trim()}</div>`
      }
      html += '</div>'
    }
    html += '</div>'
    return html
  }

  function formatFreeVerse(lines) {
    // Preserve original line breaks and spacing
    return `<div class="text-center space-y-3">${lines.map(line => {
      const trimmed = line.trim()
      if (trimmed === '') {
        return '<div class="h-4"></div>' // Empty line spacing
      }
      return `<div class="leading-relaxed">${trimmed}</div>`
    }).join('')}</div>`
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
  <section class="py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Poem Container for Screenshot -->
      <div bind:this={poemElement} class="bg-white rounded-3xl shadow-2xl p-8 md:p-16 mb-12 relative overflow-hidden">
        <!-- Decorative background pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full -translate-x-16 -translate-y-16"></div>
          <div class="absolute bottom-0 right-0 w-24 h-24 bg-blue-500 rounded-full translate-x-12 translate-y-12"></div>
          <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500 rounded-full transform -translate-x-8 -translate-y-8"></div>
        </div>
        
        <!-- Content -->
        <div class="relative z-10">
          <!-- Tags -->
          <div class="flex justify-center gap-3 mb-8">
            {#if poem.style}
              <span class="inline-block bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm font-medium px-4 py-2 rounded-full border border-purple-200">{poem.style}</span>
            {/if}
            {#if poem.theme}
              <span class="inline-block bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-medium px-4 py-2 rounded-full border border-blue-200">{poem.theme}</span>
            {/if}
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-6xl font-bold font-serif mb-12 text-gray-800 leading-tight">{poem.title}</h1>

          <!-- Poem Content with Proper Formatting -->
          <div class="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {@html formatPoemHTML(poem.content, poem.style)}
          </div>

          <!-- Metadata -->
          <div class="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm mt-12 pt-8 border-t border-gray-100">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(poem.created_at)}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{poem.views || 0} views</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>AI Generated</span>
            </div>
            <div class="flex items-center font-mono text-xs">
              <span>MereAutomaton.club</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <!-- Download Screenshot -->
        <button 
          on:click={downloadScreenshot} 
          disabled={isCapturing}
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {#if isCapturing}
            <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Creating...
          {:else}
            <Camera class="w-5 h-5" />
            Download Image
          {/if}
        </button>

        <!-- Copy URL -->
        <button 
          on:click={copyUrl}
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {#if urlCopied}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          {:else}
            <Copy class="w-5 h-5" />
            Copy URL
          {/if}
        </button>

        <!-- Share Poem Text -->
        <button 
          on:click={sharePoem} 
          class="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {#if copied}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          {:else}
            <Share2 class="w-5 h-5" />
            Share Text
          {/if}
        </button>

        <!-- Create Your Own -->
        <a 
          href="/" 
          class="flex items-center justify-center gap-2 bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Your Own
        </a>
      </div>

      <!-- Social Sharing Tips -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
        <h3 class="font-semibold text-gray-800 mb-3">Perfect for sharing</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          <div class="flex items-center justify-center gap-2">
            <Camera class="w-4 h-4 text-emerald-600" />
            <span>Download as image</span>
          </div>
          <div class="flex items-center justify-center gap-2">
            <Copy class="w-4 h-4 text-blue-600" />
            <span>Copy direct link</span>
          </div>
          <div class="flex items-center justify-center gap-2">
            <Share2 class="w-4 h-4 text-purple-600" />
            <span>Share poem text</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Enhanced Footer -->
  <footer class="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="mb-6">
        <a href="/" class="inline-block">
          <div class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            MereAutomaton.club
          </div>
          <div class="text-sm text-gray-500">AI Poetry Platform</div>
        </a>
      </div>
      
      <p class="text-gray-600 mb-4">
        This poem was crafted by artificial intelligence, where creativity meets technology
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Powered by AI</span>
        </div>
        <div class="hidden sm:block">•</div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
          <span>Unique subdomain</span>
        </div>
        <div class="hidden sm:block">•</div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span>Easy to share</span>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-400">
          Create your own AI-generated poem and get a custom subdomain at MereAutomaton.club
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  /* Custom styles for better screenshot appearance */
  @media print {
    .no-print {
      display: none !important;
    }
  }
  
  /* Ensure fonts load properly for screenshots */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
</style>

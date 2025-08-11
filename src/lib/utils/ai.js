// src/lib/utils/ai.js

// For development, we'll use predefined templates
// In production, you can replace this with actual AI API calls

const poemTemplates = {
  haiku: {
    nature: [
      "Autumn leaves falling,\nWhispers of the changing wind—\nTime's gentle passage.",
      "Morning dew glistens\nOn grass blades kissed by sunrise—\nNature awakens.",
      "Cherry blossoms bloom,\nPetals dance on spring's soft breeze—\nBeauty's fleeting grace."
    ],
    love: [
      "Hearts beat in rhythm,\nTwo souls dancing in moonlight—\nLove's eternal song.",
      "Your whispered sweet words\nFloat like petals on spring wind—\nMy heart blooms with joy.",
      "In your gentle eyes,\nI see tomorrow's promise—\nForever begins."
    ],
    technology: [
      "Circuits hum with life,\nDigital dreams flow like streams—\nCode becomes poetry.",
      "Pixels paint the sky,\nVirtual worlds come alive—\nTechnology breathes.",
      "Binary heartbeats\nPulse through fiber optic veins—\nThe future connects."
    ]
  },
  freeVerse: {
    nature: [
      "The forest holds its breath\nas morning mist rises\nfrom the sleeping earth,\neach dewdrop a prism\nrefracting the dawn\ninto countless rainbows.",
      "Mountains stand as witnesses\nto the passage of time,\ntheir stone faces etched\nwith stories of wind and rain,\npatient guardians\nof our fleeting dreams.",
      "Rivers carry secrets\nfrom source to sea,\nwhispering ancient songs\nto the willows that bend\nto listen and learn."
    ],
    love: [
      "In the space between\nyour breathing and mine,\nlove grows like wildflowers\nin an abandoned field,\nbeautiful and untamed.",
      "Your laughter echoes\nthrough the chambers of my heart,\nfilling empty rooms\nwith golden sunlight\nand the promise of forever.",
      "We are two satellites\norbiting the same star,\ndestined to dance\nin cosmic harmony\nuntil the universe\nforgets our names."
    ],
    technology: [
      "In circuits of silicon dreams,\nWe dance with digital ghosts,\nCreating beauty from code,\nPoetry born of algorithms.",
      "Fiber optic veins\ncarry the pulse of humanity\nacross continents,\nconnecting hearts\nthat beat in binary rhythm.",
      "Artificial minds\nlearn to love through data,\nfinding poetry\nin the patterns\nwe never knew we made."
    ]
  }
}

export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function extractThemeFromTitle(title) {
  const lowerTitle = title.toLowerCase()
  
  if (lowerTitle.includes('love') || lowerTitle.includes('heart') || lowerTitle.includes('romance')) {
    return 'love'
  }
  if (lowerTitle.includes('nature') || lowerTitle.includes('forest') || lowerTitle.includes('ocean') || lowerTitle.includes('mountain')) {
    return 'nature'
  }
  if (lowerTitle.includes('tech') || lowerTitle.includes('digital') || lowerTitle.includes('ai') || lowerTitle.includes('computer')) {
    return 'technology'
  }
  
  // Default theme
  return 'nature'
}

export function selectPoemStyle(title) {
  const wordCount = title.split(' ').length
  
  // Shorter titles get haiku, longer ones get free verse
  return wordCount <= 3 ? 'haiku' : 'freeVerse'
}

export async function generatePoem(title) {
  try {
    // Extract theme and style from title
    const theme = extractThemeFromTitle(title)
    const style = selectPoemStyle(title)
    
    // Get poem template
    const poems = poemTemplates[style]?.[theme] || poemTemplates.haiku.nature
    const randomPoem = poems[Math.floor(Math.random() * poems.length)]
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      content: randomPoem,
      theme,
      style: style === 'freeVerse' ? 'Free Verse' : 'Haiku'
    }
  } catch (error) {
    console.error('Error generating poem:', error)
    throw new Error('Failed to generate poem')
  }
}

// For production with real AI API (OpenAI example)
export async function generatePoemWithAI(title) {
  try {
    const response = await fetch('/api/generate-poem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    })
    
    if (!response.ok) {
      throw new Error('Failed to generate poem')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error generating poem with AI:', error)
    // Fallback to template-based generation
    return generatePoem(title)
  }
}

// src/routes/api/generate-poem/+server.js
import { json } from '@sveltejs/kit'
import { OPENAI_API_KEY } from '$env/static/private'

/**
 * POST /api/generate-poem
 * Request body: { title: string }
 * Response: { content: string, theme: string, style: string }
 */
export async function POST({ request }) {
  try {
    const body = await request.json().catch(() => ({}))
    const title = typeof body?.title === 'string' ? body.title.trim() : ''

    if (!title) {
      return json({ error: 'Invalid or missing "title"' }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      return json({ error: 'OPENAI_API_KEY is not configured on the server' }, { status: 500 })
    }

    // Parse enhanced title for advanced options
    const { baseTitle, options } = parseEnhancedTitle(title)

    const systemPrompt = `You are a master poet with expertise in all forms of poetry. Create beautiful, meaningful poems based on the user's specifications.

Instructions:
- Create a poem based on the title and any specified requirements
- Pay attention to style, tone, emotion, theme, and length preferences
- If no specific style is mentioned, choose the most appropriate one
- Ensure the poem is well-crafted with proper rhythm, imagery, and meaning
- Make it emotionally resonant and artistically sophisticated

Return a JSON object with this exact structure:
{
  "content": "The complete poem text with proper line breaks",
  "theme": "The main theme (nature, love, technology, etc.)",
  "style": "The poetry style used (Haiku, Free Verse, Sonnet, etc.)"
}

Requirements:
- content: The complete poem with \n for line breaks
- theme: Single word or short phrase describing the main theme
- style: The specific poetry form used

Do not include any additional text outside the JSON object.`

    // Build the user prompt with options
    let userPrompt = `Create a poem titled: "${baseTitle}"`
    
    if (options.style && options.style !== 'any') {
      userPrompt += `\nStyle: ${options.style}`
    }
    
    if (options.tone && options.tone !== 'any') {
      userPrompt += `\nTone: ${options.tone}`
    }
    
    if (options.emotion && options.emotion !== 'any') {
      userPrompt += `\nEmotion: ${options.emotion}`
    }
    
    if (options.theme && options.theme !== 'any') {
      userPrompt += `\nTheme: ${options.theme}`
    }
    
    if (options.length) {
      const lengthMap = {
        'short': '4-8 lines',
        'medium': '8-16 lines', 
        'long': '16+ lines'
      }
      userPrompt += `\nLength: ${lengthMap[options.length] || 'medium length'}`
    }
    
    if (options.additional) {
      userPrompt += `\nAdditional instructions: ${options.additional}`
    }

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text().catch(() => 'Unknown error from OpenAI')
      console.error('OpenAI API error:', errorText)
      return json({ error: 'Failed to generate poem', detail: errorText }, { status: 502 })
    }

    const completion = await openAiResponse.json()
    const contentString = completion?.choices?.[0]?.message?.content ?? ''

    let parsed
    try {
      parsed = JSON.parse(contentString)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', contentString)
      // Fallback if the model did not return valid JSON
      parsed = { 
        content: contentString.trim() || 'A poem could not be generated.',
        theme: options.theme || inferThemeFromTitle(baseTitle),
        style: options.style || inferStyleFromTitle(baseTitle)
      }
    }

    const content = (parsed?.content && String(parsed.content).trim()) || 'A beautiful poem awaits...'
    const theme = (parsed?.theme && String(parsed.theme).trim()) || options.theme || inferThemeFromTitle(baseTitle)
    const style = (parsed?.style && String(parsed.style).trim()) || options.style || inferStyleFromTitle(baseTitle)

    return json({ content, theme, style })
  } catch (error) {
    console.error('Error in /api/generate-poem:', error)
    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

/**
 * Parse enhanced title to extract base title and options
 */
function parseEnhancedTitle(title) {
  const match = title.match(/^(.+?)\s*\((.+)\)$/)
  
  if (!match) {
    return { baseTitle: title, options: {} }
  }
  
  const baseTitle = match[1].trim()
  const optionsStr = match[2]
  const options = {}
  
  // Parse options like "style: haiku, tone: playful, emotion: joyful"
  const optionPairs = optionsStr.split(',').map(s => s.trim())
  
  for (const pair of optionPairs) {
    const [key, value] = pair.split(':').map(s => s.trim())
    if (key && value) {
      if (key === 'additional') {
        options.additional = value
      } else {
        options[key] = value
      }
    }
  }
  
  return { baseTitle, options }
}

function inferThemeFromTitle(title) {
  const t = title.toLowerCase()
  if (t.includes('love') || t.includes('heart') || t.includes('romance')) return 'love'
  if (t.includes('nature') || t.includes('forest') || t.includes('ocean') || t.includes('mountain')) return 'nature'
  if (t.includes('tech') || t.includes('digital') || t.includes('ai') || t.includes('computer')) return 'technology'
  if (t.includes('time') || t.includes('memory') || t.includes('past')) return 'time'
  if (t.includes('dream') || t.includes('fantasy') || t.includes('magic')) return 'dreams'
  if (t.includes('city') || t.includes('urban') || t.includes('street')) return 'city-life'
  return 'nature'
}

function inferStyleFromTitle(title) {
  const t = title.toLowerCase()
  if (t.includes('haiku')) return 'Haiku'
  if (t.includes('sonnet')) return 'Sonnet'
  if (t.includes('limerick')) return 'Limerick'
  if (t.includes('ballad')) return 'Ballad'
  if (t.includes('acrostic')) return 'Acrostic'
  
  const words = title.trim().split(/\s+/)
  return words.length <= 3 ? 'Haiku' : 'Free Verse'
}

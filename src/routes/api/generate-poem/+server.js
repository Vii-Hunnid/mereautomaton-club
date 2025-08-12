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

    const systemPrompt = `You are a helpful poetry generator. Given a poem title, produce a short poem and identify a theme and style.
Return a compact JSON object with the following shape:
{ "content": string, "theme": "nature" | "love" | "technology" | string, "style": "Haiku" | "Free Verse" | string }
Do not include any additional commentary.`

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
          { role: 'user', content: `Title: ${title}` }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    })

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text().catch(() => 'Unknown error from OpenAI')
      return json({ error: 'Failed to generate poem', detail: errorText }, { status: 502 })
    }

    const completion = await openAiResponse.json()
    const contentString = completion?.choices?.[0]?.message?.content ?? ''

    let parsed
    try {
      parsed = JSON.parse(contentString)
    } catch {
      // Fallback if the model did not return valid JSON
      parsed = { content: String(contentString || '').trim() }
    }

    const content = (parsed?.content && String(parsed.content).trim()) || 'Untitled poem.'
    const theme = (parsed?.theme && String(parsed.theme).trim()) || inferThemeFromTitle(title)
    const style = (parsed?.style && String(parsed.style).trim()) || inferStyleFromTitle(title)

    return json({ content, theme, style })
  } catch (error) {
    console.error('Error in /api/generate-poem:', error)
    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function inferThemeFromTitle(title) {
  const t = title.toLowerCase()
  if (t.includes('love') || t.includes('heart') || t.includes('romance')) return 'love'
  if (t.includes('nature') || t.includes('forest') || t.includes('ocean') || t.includes('mountain')) return 'nature'
  if (t.includes('tech') || t.includes('digital') || t.includes('ai') || t.includes('computer')) return 'technology'
  return 'nature'
}

function inferStyleFromTitle(title) {
  const words = title.trim().split(/\s+/)
  return words.length <= 3 ? 'Haiku' : 'Free Verse'
}



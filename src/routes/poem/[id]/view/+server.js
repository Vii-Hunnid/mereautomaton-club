// src/routes/api/poems/[id]/view/+server.js
import { incrementViews } from '$lib/utils/supabase.js'
import { json } from '@sveltejs/kit'

export async function POST({ params }) {
  const { id } = params
  
  try {
    await incrementViews(id)
    return json({ success: true })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return json({ success: false }, { status: 500 })
  }
}

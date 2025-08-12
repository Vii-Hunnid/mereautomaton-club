// src/routes/api/poems/[id]/view/+server.js
import { incrementViews } from '$lib/utils/supabase.js'
import { json } from '@sveltejs/kit'

export async function POST({ params }) {
  const { id } = params
  
  if (!id) {
    return json({ error: 'Missing poem ID' }, { status: 400 })
  }
  
  try {
    console.log('Incrementing views for poem ID:', id)
    await incrementViews(id)
    return json({ success: true })
  } catch (error) {
    console.error('Error incrementing views:', error)
    return json({ success: false, error: error.message }, { status: 500 })
  }
}

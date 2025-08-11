// src/routes/+page.server.js
import { getAllPoems } from '$lib/utils/supabase.js'

export async function load() {
  try {
    const poems = await getAllPoems()
    
    return {
      poems: poems || []
    }
  } catch (error) {
    console.error('Error loading poems:', error)
    return {
      poems: []
    }
  }
}

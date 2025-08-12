// src/routes/[subdomain]/+page.server.js
import { getPoemBySubdomain } from '$lib/utils/supabase.js'
import { error } from '@sveltejs/kit'

export async function load({ params, url }) {
  const { subdomain } = params
  
  // Skip if this is the main domain or www
  if (subdomain === 'mereautomaton' || subdomain === 'www') {
    throw error(404, 'Not found')
  }
  
  try {
    const poem = await getPoemBySubdomain(subdomain)
    
    if (!poem) {
      throw error(404, 'Poem not found')
    }
    
    return {
      poem
    }
  } catch (err) {
    console.error('Error loading poem:', err)
    throw error(404, 'Poem not found')
  }
}

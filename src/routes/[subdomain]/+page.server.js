// src/routes/[subdomain]/+page.server.js
import { getPoemBySubdomain } from '$lib/utils/supabase.js'
import { error, redirect } from '@sveltejs/kit'

export async function load({ params, url, request }) {
  const { subdomain } = params
  const host = request.headers.get('host') || ''
  
  console.log('Subdomain route hit:', { subdomain, host, url: url.pathname })
  
  // If this is actually the main domain, redirect to home
  if (host === 'mereautomaton.club' || host === 'www.mereautomaton.club') {
    throw redirect(302, '/')
  }
  
  // Skip certain reserved subdomains
  if (subdomain === 'www' || subdomain === 'api' || subdomain === 'admin') {
    throw error(404, 'Not found')
  }
  
  try {
    console.log('Looking for poem with subdomain:', subdomain)
    const poem = await getPoemBySubdomain(subdomain)
    
    if (!poem) {
      console.log('No poem found for subdomain:', subdomain)
      throw error(404, 'Poem not found')
    }
    
    console.log('Found poem:', poem.title)
    return {
      poem,
      subdomain,
      isSubdomain: true
    }
  } catch (err) {
    console.error('Error loading poem:', err)
    throw error(404, 'Poem not found')
  }
}

// src/hooks.server.js
import { PUBLIC_DOMAIN } from '$env/static/public'

export async function handle({ event, resolve }) {
  // Get the host from the request
  const host = event.request.headers.get('host') || ''
  
  // Check if this is a subdomain request
  const isSubdomain = host.includes('.') && host !== PUBLIC_DOMAIN && host !== `www.${PUBLIC_DOMAIN}`
  
  if (isSubdomain) {
    // Extract subdomain
    const subdomain = host.split('.')[0]
    
    // Add subdomain info to event locals
    event.locals.subdomain = subdomain
    event.locals.isSubdomain = true
    
    // Rewrite the URL to handle subdomain routing
    // This will make poemtitle.mereautomaton.club load the poem page
    const url = new URL(event.request.url)
    url.pathname = `/poem/${subdomain}`
    
    // Create a new request with the rewritten URL
    const newRequest = new Request(url, event.request)
    event.request = newRequest
  } else {
    event.locals.isSubdomain = false
    event.locals.subdomain = null
  }
  
  const response = await resolve(event)
  return response
}

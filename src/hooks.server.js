// src/hooks.server.js
import { PUBLIC_DOMAIN } from '$env/static/public'

export async function handle({ event, resolve }) {
  const host = event.request.headers.get('host') || ''
  const domain = PUBLIC_DOMAIN || 'mereautomaton.club'
  
  console.log('Request host:', host, 'Domain:', domain)
  
  // Check if this is a subdomain request
  const isSubdomain = host.includes('.') && 
    host !== domain && 
    host !== `www.${domain}` &&
    !host.includes('localhost') &&
    !host.includes('vercel.app')
  
  console.log('Is subdomain:', isSubdomain)
  
  if (isSubdomain) {
    // Extract subdomain (everything before the first dot)
    const subdomain = host.split('.')[0]
    console.log('Extracted subdomain:', subdomain)
    
    // Add subdomain info to event locals
    event.locals.subdomain = subdomain
    event.locals.isSubdomain = true
    
    // Rewrite the URL to handle subdomain routing
    const url = new URL(event.request.url)
    
    // Only rewrite if we're at the root path
    if (url.pathname === '/' || url.pathname === '') {
      console.log('Rewriting URL for subdomain:', subdomain)
      url.pathname = `/${subdomain}`
      
      // Create a new request with the rewritten URL
      const newRequest = new Request(url, {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body
      })
      event.request = newRequest
    }
  } else {
    event.locals.isSubdomain = false
    event.locals.subdomain = null
  }
  
  const response = await resolve(event)
  return response
}

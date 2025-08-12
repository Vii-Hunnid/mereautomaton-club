// src/hooks.server.js - Debug version
export async function handle({ event, resolve }) {
  const host = event.request.headers.get('host') || ''
  const url = new URL(event.request.url)
  
  console.log('=== REQUEST DEBUG ===')
  console.log('Host:', host)
  console.log('Original URL:', url.href)
  console.log('Pathname:', url.pathname)
  
  // Check if this is a subdomain request
  const isMainDomain = host === 'mereautomaton.club' || host === 'www.mereautomaton.club'
  const isLocalhost = host.includes('localhost')
  const isVercel = host.includes('vercel.app')
  
  const isSubdomain = host.includes('.') && !isMainDomain && !isLocalhost && !isVercel
  
  console.log('Domain checks:', { isMainDomain, isLocalhost, isVercel, isSubdomain })
  
  if (isSubdomain) {
    // Extract subdomain (everything before the first dot)
    const subdomain = host.split('.')[0]
    console.log('Detected subdomain:', subdomain)
    
    // Add subdomain info to event locals
    event.locals.subdomain = subdomain
    event.locals.isSubdomain = true
    
    // Only rewrite if we're at the root path
    if (url.pathname === '/' || url.pathname === '') {
      console.log('Rewriting URL from', url.pathname, 'to', `/${subdomain}`)
      url.pathname = `/${subdomain}`
      
      // Create a new request with the rewritten URL
      const newRequest = new Request(url, {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body
      })
      event.request = newRequest
      console.log('New URL:', url.href)
    }
  } else {
    console.log('Not a subdomain request')
    event.locals.isSubdomain = false
    event.locals.subdomain = null
  }
  
  const response = await resolve(event)
  console.log('=== END REQUEST DEBUG ===')
  return response
}

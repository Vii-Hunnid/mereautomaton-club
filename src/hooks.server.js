// src/hooks.server.js
import { redirect } from '@sveltejs/kit'

export async function handle({ event, resolve }) {
  const host = event.request.headers.get('host') || ''
  const url = new URL(event.request.url)

  const isMain = host === 'mereautomaton.club' || host === 'www.mereautomaton.club'
  const isLocal = host.includes('localhost')
  const isVercel = host.includes('vercel.app')
  const isSub = host.includes('.') && !isMain && !isLocal && !isVercel

  if (isSub) {
    const sub = host.split('.')[0]
    event.locals.isSubdomain = true
    event.locals.subdomain = sub

    if (url.pathname === '/' || url.pathname === '') {
      throw redirect(307, `/${sub}`) // real redirect
    }
  } else {
    event.locals.isSubdomain = false
    event.locals.subdomain = null
  }

  return resolve(event)
}




// // src/hooks.server.js - Debug version
// export async function handle({ event, resolve }) {
//   const host = event.request.headers.get('host') || ''
//   const url = new URL(event.request.url)
  
//   console.log('=== HOOKS DEBUG ===')
//   console.log('Host:', host)
//   console.log('Original URL:', url.href)
//   console.log('Pathname:', url.pathname)
  
//   // Check if this is a subdomain request
//   const isMainDomain = host === 'mereautomaton.club' || host === 'www.mereautomaton.club'
//   const isLocalhost = host.includes('localhost')
//   const isVercel = host.includes('vercel.app')
  
//   const isSubdomain = host.includes('.') && !isMainDomain && !isLocalhost && !isVercel
  
//   console.log('Domain checks:', { isMainDomain, isLocalhost, isVercel, isSubdomain })
  
//   if (isSubdomain) {
//     // Extract subdomain (everything before the first dot)
//     const subdomain = host.split('.')[0]
//     console.log('Detected subdomain:', subdomain)
    
//     // Add subdomain info to event locals
//     event.locals.subdomain = subdomain
//     event.locals.isSubdomain = true
    
//     // Only rewrite if we're at the root path
//     if (url.pathname === '/' || url.pathname === '') {
//       console.log('Rewriting URL from', url.pathname, 'to', `/${subdomain}`)
//       url.pathname = `/${subdomain}`
      
//       // Create a new request with the rewritten URL
//       const newRequest = new Request(url, {
//         method: event.request.method,
//         headers: event.request.headers,
//         body: event.request.body
//       })
//       event.request = newRequest
//       console.log('New URL:', url.href)
//     }
//   } else {
//     console.log('Not a subdomain request')
//     event.locals.isSubdomain = false
//     event.locals.subdomain = null
    
//     // If someone tries to access /[subdomain] on main domain, block it
//     const pathSegments = url.pathname.split('/').filter(Boolean)
//     if (pathSegments.length === 1 && pathSegments[0].match(/^[a-z0-9-]+$/)) {
//       // This looks like a subdomain path on the main domain - block it
//       const potentialSubdomain = pathSegments[0]
//       if (potentialSubdomain !== 'poems' && potentialSubdomain !== 'create') {
//         console.log('Blocking subdomain-like path on main domain:', potentialSubdomain)
//         throw new Response('Not Found', { status: 404 })
//       }
//     }
//   }
  
//   const response = await resolve(event)
//   console.log('=== END HOOKS DEBUG ===')
//   return response
// }

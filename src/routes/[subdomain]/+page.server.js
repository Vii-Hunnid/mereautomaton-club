// // src/routes/[subdomain]/+page.server.js
// import { getPoemBySubdomain } from '$lib/utils/supabase.js'
// import { error } from '@sveltejs/kit'

// export async function load({ params, locals }) {
//   const { subdomain } = params

//   // Serve ONLY when the incoming host is actually that subdomain
//   if (!locals.isSubdomain || locals.subdomain !== subdomain) {
//     throw error(404, 'Not found')
//   }

//   const poem = await getPoemBySubdomain(subdomain)
//   if (!poem) throw error(404, 'Poem not found')

//   return { poem, subdomain, isSubdomain: true }
// }




// // src/routes/[subdomain]/+page.server.js
// import { getPoemBySubdomain } from '$lib/utils/supabase.js'
// import { error } from '@sveltejs/kit'

// export async function load({ params, locals }) {
//   const { subdomain } = params

//   // Only allow this route when we are actually on a subdomain host
//   if (!locals.isSubdomain || locals.subdomain !== subdomain) {
//     throw error(404, 'Not found')
//   }

//   const poem = await getPoemBySubdomain(subdomain)
//   if (!poem) throw error(404, 'Poem not found')

//   return {
//     poem,
//     subdomain,
//     isSubdomain: true
//   }
// }




// src/routes/[subdomain]/+page.server.js
import { getPoemBySubdomain } from '$lib/utils/supabase.js'
import { error } from '@sveltejs/kit'

export async function load({ params, url, request }) {
  const { subdomain } = params
  const host = request.headers.get('host') || ''
  
  console.log('=== SUBDOMAIN ROUTE DEBUG ===')
  console.log('Params subdomain:', subdomain)
  console.log('Host:', host)
  console.log('URL pathname:', url.pathname)
  console.log('Full URL:', url.href)
  
  // Skip if this is the main domain or www
  if (subdomain === 'mereautomaton' || subdomain === 'www') {
    console.log('Skipping main domain')
    throw error(404, 'Not found')
  }
  
  try {
    console.log('Fetching poem for subdomain:', subdomain)
    const poem = await getPoemBySubdomain(subdomain)
    
    if (!poem) {
      console.log('No poem found for subdomain:', subdomain)
      throw error(404, 'Poem not found')
    }
    
    console.log('Found poem:', poem.title)
    console.log('=== END SUBDOMAIN ROUTE DEBUG ===')
    
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

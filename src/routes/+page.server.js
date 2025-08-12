// src/routes/+page.server.js
import { getPoemBySubdomain, getRecentPoems } from '$lib/utils/supabase.js'
import { error } from '@sveltejs/kit'

export async function load({ locals, url }) {
  // Subdomain: show the poem at the root only
  if (locals.isSubdomain) {
    if (url.pathname !== '/') throw error(404, 'Not found')
    const poem = await getPoemBySubdomain(locals.subdomain)
    if (!poem) throw error(404, 'Poem not found')
    return { isSubdomain: true, poem, subdomain: locals.subdomain, poems: [] }
  }

  // Main domain: fetch recent poems for the homepage grid
  const res = await getRecentPoems()
  // If your util returns { data }, destructure like:
  // const { data: poems = [] } = await getRecentPoems()
  const poems = Array.isArray(res) ? res : (res?.data ?? [])
  return { isSubdomain: false, poems }
}




// // src/routes/+page.server.js
// import { getPoemBySubdomain } from '$lib/utils/supabase.js'
// import { error } from '@sveltejs/kit'

// export async function load({ locals }) {
//   if (!locals.isSubdomain) {
//     // Main domain: render your normal homepage
//     return { isSubdomain: false }
//   }

//   const poem = await getPoemBySubdomain(locals.subdomain)
//   if (!poem) throw error(404, 'Poem not found')

//   return { isSubdomain: true, poem, subdomain: locals.subdomain }
// }

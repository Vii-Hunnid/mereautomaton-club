// src/routes/+page.server.js
import { getPoemBySubdomain } from '$lib/utils/supabase.js'
import { error } from '@sveltejs/kit'

export async function load({ locals }) {
  if (!locals.isSubdomain) {
    // Main domain: render your normal homepage
    return { isSubdomain: true, poems: [] }
  }

  const poem = await getPoemBySubdomain(locals.subdomain)
  if (!poem) throw error(404, 'Poem not found')

  return { isSubdomain: true, poem, subdomain: locals.subdomain }
}

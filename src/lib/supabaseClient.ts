import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  // Optional: warn in dev so you catch it early
  console.warn('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}
export const supa = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

if (!SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE');
}
export const supaAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false }
});

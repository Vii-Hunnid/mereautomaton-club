// src/lib/server/supa.ts (server-only admin client)
import { createClient } from '@supabase/supabase-js';
export const supaAdmin = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  { auth: { persistSession: false } }
);

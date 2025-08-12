// src/routes/+layout.server.ts
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

function todaySA(): string {
  const now = new Date(
    new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
  );
  return now.toISOString().slice(0,10);
}

export const load = async ({ locals, url }) => {
  const { data: s } = await supabaseAdmin
    .from('sponsor_slots')
    .select('*')
    .eq('date', todaySA())
    .eq('status','approved')
    .maybeSingle();

  // Count an impression once per page view
  if (s) {
    await supabaseAdmin.rpc('inc_sponsor_impressions', { slot_id: s.id });
  }
  return { sponsor: s ?? null };
};

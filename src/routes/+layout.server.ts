// src/routes/+layout.server.ts
import { supaAdmin } from '$lib/server/supa';

function todaySA(): string {
  const now = new Date(
    new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
  );
  return now.toISOString().slice(0,10);
}

export const load = async ({ locals, url }) => {
  const { data: s } = await supaAdmin
    .from('sponsor_slots')
    .select('*')
    .eq('date', todaySA())
    .eq('status','approved')
    .maybeSingle();

  // Count an impression once per page view
  if (s) {
    await supaAdmin.rpc('inc_sponsor_impressions', { slot_id: s.id });
  }
  return { sponsor: s ?? null };
};

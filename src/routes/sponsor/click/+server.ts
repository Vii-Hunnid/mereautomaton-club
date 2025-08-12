// src/routes/sponsor/click/+server.ts
import { supaAdmin } from '$lib/server/supa';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  const id = url.searchParams.get('slot');
  if (!id) throw redirect(302, '/');

  const { data: s } = await supaAdmin.from('sponsor_slots').select('url').eq('id', id).maybeSingle();
  if (s?.url) {
    await supaAdmin.rpc('inc_sponsor_clicks', { slot_id: id });
    const sep = s.url.includes('?') ? '&' : '?';
    throw redirect(302, `${s.url}${sep}utm_source=mereautomaton&utm_medium=sponsor&utm_campaign=${new Date().toISOString().slice(0,10)}`);
  }
  throw redirect(302, '/');
};

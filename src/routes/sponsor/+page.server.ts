// src/routes/sponsor/+page.server.ts
import { supaAdmin } from '$lib/server/supa';
import { fail, redirect } from '@sveltejs/kit';

function todaySA(): string {
  const now = new Date(
    new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })
  );
  return now.toISOString().slice(0,10);
}
const WEEKEND_SURCHARGE = 100; // tweak
const BASE_PRICE = 150;

export const load = async () => {
  // Clean stale reservations (>30min)
  await supaAdmin.from('sponsor_slots')
    .update({ status: 'available', reserved_until: null })
    .lt('reserved_until', new Date().toISOString())
    .eq('status','reserved');

  const { data } = await supaAdmin.from('sponsor_slots')
    .select('id, date, status, paid, sponsor_name')
    .gte('date', todaySA())
    .order('date', { ascending: true });
  return { slots: data ?? [] };
};

export const actions = {
  reserve: async ({ request }) => {
    const form = await request.formData();
    const date = String(form.get('date'));

    // Compute price
    const d = new Date(date + 'T00:00:00');
    const weekend = [0,6].includes(d.getDay());
    const amount = BASE_PRICE + (weekend ? WEEKEND_SURCHARGE : 0);

    // Reserve (if still available)
    const { data: slot, error } = await supaAdmin.from('sponsor_slots')
      .update({
        status: 'reserved',
        reserved_until: new Date(Date.now() + 30*60*1000).toISOString()
      })
      .eq('date', date)
      .eq('status','available')
      .select('*')
      .single();

    if (error || !slot) return fail(409, { message: 'Date just got snapped up. Try another.' });

    // Build payment link with reference + metadata
    const base = process.env.PAYMENT_LINK_BASE!;
    const reference = slot.id; // use slot id for reconciliation
    const metadata = encodeURIComponent(JSON.stringify({ slot_id: slot.id, date }));
    // Adjust params to your provider’s format; most accept amount + reference + metadata
    const payUrl = `${base}?amount=${amount}&reference=${reference}&metadata=${metadata}`;

    throw redirect(302, payUrl);
  }
};

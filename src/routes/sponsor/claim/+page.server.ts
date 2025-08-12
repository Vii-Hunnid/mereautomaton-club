// src/routes/sponsor/claim/+page.server.ts (sketch)
import { supaAdmin } from '$lib/server/supa';
import { fail } from '@sveltejs/kit';

export const actions = {
  submit: async ({ request }) => {
    const f = await request.formData();
    const id = String(f.get('slot_id'));
    const patch = {
      sponsor_name: f.get('sponsor_name'),
      headline: f.get('headline'),
      body: f.get('body'),
      url: f.get('url'),
      image_url: f.get('image_url'),
      status: 'approved'
    };
    const { error } = await supaAdmin.from('sponsor_slots')
      .update(patch).eq('id', id).eq('paid', true).eq('status','booked');
    if (error) return fail(400, { message: 'Could not approve.' });
    return { ok: true };
  }
};

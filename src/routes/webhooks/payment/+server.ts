// src/routes/webhooks/payment/+server.ts
import { supaAdmin } from '$lib/server/supabaseAdmin';
import type { RequestHandler } from './$types';
import crypto from 'crypto';

function verifySig(body: string, headerSig: string | null, secret: string) {
  if (!headerSig) return false;
  const h = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(headerSig));
}

export const POST: RequestHandler = async ({ request }) => {
  const raw = await request.text();
  const ok = verifySig(raw, request.headers.get('x-webhook-signature'), process.env.PAYMENT_WEBHOOK_SECRET!);
  if (!ok) return new Response('invalid signature', { status: 400 });

  const evt = JSON.parse(raw);
  // Shape varies by provider. Adjust the paths:
  const meta = evt?.data?.metadata ?? evt?.metadata ?? {};
  const slot_id: string | undefined = meta.slot_id || meta.reference || evt?.data?.reference;
  const payment_ref: string = evt?.data?.id ?? evt?.id ?? crypto.randomUUID();

  if (!slot_id) return new Response('missing slot', { status: 422 });

  await supaAdmin.from('sponsor_slots')
    .update({ paid: true, status: 'booked', payment_ref })
    .eq('id', slot_id);

  return new Response('ok');
};

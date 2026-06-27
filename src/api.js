export async function handleAPI(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  // POST /api/waitlist — email capture from landing page
  if (path === '/api/waitlist' && request.method === 'POST') {
    const { email, name } = await request.json();
    if (!email || !email.includes('@')) return json({ error: 'Valid email required' }, 400);
    try {
      await env.DB.prepare(
        'INSERT INTO waitlist (email, name) VALUES (?, ?) ON CONFLICT(email) DO NOTHING'
      ).bind(email.toLowerCase().trim(), name || null).run();
      return json({ ok: true, message: "You're on the list. We'll be in touch." });
    } catch (e) {
      return json({ error: 'Failed to save' }, 500);
    }
  }

  // POST /api/register — create account
  if (path === '/api/register' && request.method === 'POST') {
    const { name, email, phone, pin, contacts } = await request.json();
    if (!name || !email || !pin) return json({ error: 'Name, email and PIN required' }, 400);
    if (pin.length < 4 || pin.length > 8 || !/^\d+$/.test(pin))
      return json({ error: 'PIN must be 4–8 digits' }, 400);
    if (!contacts || contacts.length === 0)
      return json({ error: 'At least one contact required' }, 400);
    if (contacts.length > 10)
      return json({ error: 'Maximum 10 contacts allowed' }, 400);

    const memberNumber = generateMemberNumber();
    const pinHash = await hashPin(pin);

    try {
      const result = await env.DB.prepare(
        'INSERT INTO users (name, email, phone, member_number, pin_hash) VALUES (?, ?, ?, ?, ?)'
      ).bind(name, email.toLowerCase().trim(), phone || null, memberNumber, pinHash).run();

      const userId = result.meta.last_row_id;

      for (let i = 0; i < contacts.length; i++) {
        const c = contacts[i];
        if (c.name && c.phone) {
          await env.DB.prepare(
            'INSERT INTO contacts (user_id, name, phone, relationship, sort_order) VALUES (?, ?, ?, ?, ?)'
          ).bind(userId, c.name, c.phone, c.relationship || null, i).run();
        }
      }

      return json({ ok: true, memberNumber, message: 'Account created. Save your member number.' });
    } catch (e) {
      if (e.message?.includes('UNIQUE')) return json({ error: 'Email already registered' }, 409);
      return json({ error: 'Failed to create account' }, 500);
    }
  }

  // POST /api/ivr/trigger — Twilio webhook when someone calls 1800 BUSTED and enters PIN
  // Twilio sends: Called, Caller, Digits (member_number then PIN via IVR gather)
  if (path === '/api/ivr/trigger' && request.method === 'POST') {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const memberNumber = params.get('member_number');
    const pin = params.get('pin');

    if (!memberNumber || !pin) {
      return twiml('<Say voice="alice">Sorry, we could not verify your details. Please try again.</Say>');
    }

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE member_number = ? AND active = 1'
    ).bind(memberNumber).first();

    if (!user) {
      return twiml('<Say voice="alice">Member number not found. Please check and try again.</Say>');
    }

    const pinValid = await verifyPin(pin, user.pin_hash);
    if (!pinValid) {
      return twiml('<Say voice="alice">Incorrect PIN. Please try again.</Say>');
    }

    const contacts = await env.DB.prepare(
      'SELECT * FROM contacts WHERE user_id = ? ORDER BY sort_order'
    ).bind(user.id).all();

    if (!contacts.results?.length) {
      return twiml('<Say voice="alice">No contacts found on your account. Please set them up at bustcard dot com dot au.</Say>');
    }

    const now = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
    const smsBody = `URGENT: ${user.name} has been detained and asked you to be notified. Time: ${now} AEST. They cannot be reached right now. For legal help: LawAccess NSW 1300 888 529. Aboriginal Legal Service 1800 765 767.`;

    let notified = 0;
    for (const contact of contacts.results) {
      try {
        await sendSMS(env, contact.phone, smsBody);
        notified++;
      } catch (_) {
        // best-effort — log but don't fail
      }
    }

    await env.DB.prepare(
      'INSERT INTO notifications (user_id, contacts_notified, caller_number, status) VALUES (?, ?, ?, ?)'
    ).bind(user.id, notified, params.get('Caller') || null, 'sent').run();

    return twiml(`<Say voice="alice">Done. We've sent a message to ${notified} of your contacts. Stay calm and request a lawyer before any interview. Good luck.</Say>`);
  }

  // POST /api/ivr/gather — initial Twilio IVR entry point (returns TwiML to gather digits)
  if (path === '/api/ivr/gather' && request.method === 'POST') {
    return twiml(`
      <Gather numDigits="6" action="/api/ivr/pin" method="POST" timeout="10">
        <Say voice="alice">Welcome to BustCard. Enter your 6 digit member number.</Say>
      </Gather>
      <Say voice="alice">We didn't receive your member number. Please call back.</Say>
    `);
  }

  if (path === '/api/ivr/pin' && request.method === 'POST') {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const memberNumber = params.get('Digits');
    return twiml(`
      <Gather numDigits="8" action="/api/ivr/trigger?member_number=${memberNumber}" method="POST" timeout="10">
        <Say voice="alice">Now enter your PIN.</Say>
      </Gather>
      <Say voice="alice">We didn't receive your PIN. Please call back.</Say>
    `);
  }

  // GET /api/admin/waitlist — quick check
  if (path === '/api/admin/waitlist' && request.method === 'GET') {
    const token = request.headers.get('Authorization');
    if (token !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: 'Forbidden' }, 403);
    const rows = await env.DB.prepare('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 100').all();
    return json(rows.results);
  }

  return json({ error: 'Not found' }, 404);
}

// --- Helpers ---

function generateMemberNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'bustcard_salt_2026');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPin(pin, stored) {
  const hash = await hashPin(pin);
  return hash === stored;
}

function twiml(content) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${content}</Response>`, {
    headers: { 'Content-Type': 'text/xml' },
  });
}

async function sendSMS(env, to, body) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    console.log(`[SMS stub] To: ${to} | Body: ${body}`);
    return;
  }
  const credentials = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: env.TWILIO_FROM_NUMBER, Body: body }),
    }
  );
  if (!res.ok) throw new Error(`Twilio error: ${res.status}`);
}

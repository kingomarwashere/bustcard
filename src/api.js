export async function handleAPI(request, env, corsHeaders) {
  const url = new URL(request.url);
  const path = url.pathname;
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  // POST /api/register
  if (path === '/api/register' && request.method === 'POST') {
    const { name, email, phone, dob, contacts } = await request.json();

    if (!name || !email || !phone || !dob)
      return json({ error: 'Name, email, mobile and date of birth are required.' }, 400);

    const cleanPhone = phone.replace(/\s+/g, '').replace(/^0/, '+61');
    if (!/^\+?[\d]{10,12}$/.test(cleanPhone.replace('+', '')))
      return json({ error: 'Enter a valid Australian mobile number.' }, 400);

    // DOB must be DDMMYY (6 digits)
    if (!/^\d{6}$/.test(dob))
      return json({ error: 'Date of birth must be 6 digits — DDMMYY.' }, 400);

    if (!contacts || contacts.length === 0)
      return json({ error: 'Add at least one contact.' }, 400);
    if (contacts.length > 10)
      return json({ error: 'Maximum 10 contacts.' }, 400);

    const dobHash = await hashValue(dob);

    try {
      const result = await env.DB.prepare(
        'INSERT INTO users (name, email, phone, dob_hash) VALUES (?, ?, ?, ?)'
      ).bind(name, email.toLowerCase().trim(), cleanPhone, dobHash).run();

      const userId = result.meta.last_row_id;

      for (let i = 0; i < contacts.length; i++) {
        const c = contacts[i];
        if (c.name && c.phone) {
          await env.DB.prepare(
            'INSERT INTO contacts (user_id, name, phone, relationship, sort_order) VALUES (?, ?, ?, ?, ?)'
          ).bind(userId, c.name, c.phone, c.relationship || null, i).run();
        }
      }

      return json({ ok: true, phone: cleanPhone });
    } catch (e) {
      if (e.message?.includes('UNIQUE')) {
        if (e.message.includes('email')) return json({ error: 'That email is already registered.' }, 409);
        if (e.message.includes('phone')) return json({ error: 'That mobile number is already registered.' }, 409);
      }
      return json({ error: 'Failed to create account.' }, 500);
    }
  }

  // POST /api/ivr/gather — entry point, collect mobile number
  if (path === '/api/ivr/gather' && request.method === 'POST') {
    return twiml(`
      <Gather numDigits="10" action="/api/ivr/dob" method="POST" timeout="12">
        <Say voice="alice">Welcome to 1800 Radical. Enter your 10 digit mobile number, starting with zero.</Say>
      </Gather>
      <Say voice="alice">We didn't receive your mobile number. Please call back.</Say>
    `);
  }

  // POST /api/ivr/dob — collect date of birth
  if (path === '/api/ivr/dob' && request.method === 'POST') {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const mobile = params.get('Digits');
    return twiml(`
      <Gather numDigits="6" action="/api/ivr/trigger?mobile=${mobile}" method="POST" timeout="12">
        <Say voice="alice">Now enter your date of birth as 6 digits — day, month, year. For example, the 5th of March 1990 would be 0 5 0 3 9 0.</Say>
      </Gather>
      <Say voice="alice">We didn't receive your date of birth. Please call back.</Say>
    `);
  }

  // POST /api/ivr/trigger — verify and fire SMS
  if (path === '/api/ivr/trigger' && request.method === 'POST') {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const dob = params.get('Digits');
    const mobileRaw = url.searchParams.get('mobile');

    if (!mobileRaw || !dob) {
      return twiml('<Say voice="alice">Sorry, we could not verify your details. Please call back.</Say>');
    }

    const mobile = mobileRaw.replace(/^0/, '+61');

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE phone = ? AND active = 1'
    ).bind(mobile).first();

    if (!user) {
      return twiml('<Say voice="alice">Mobile number not found. Make sure you registered at busted dot the radical party dot com.</Say>');
    }

    const dobValid = await verifyHash(dob, user.dob_hash);
    if (!dobValid) {
      return twiml('<Say voice="alice">Date of birth did not match. Please try again.</Say>');
    }

    const contacts = await env.DB.prepare(
      'SELECT * FROM contacts WHERE user_id = ? ORDER BY sort_order'
    ).bind(user.id).all();

    if (!contacts.results?.length) {
      return twiml('<Say voice="alice">No contacts on your account. Please update them at busted dot the radical party dot com.</Say>');
    }

    const now = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
    const smsBody = `URGENT: ${user.name} has been detained and asked you to be notified. Time: ${now} AEST. They cannot be reached. Legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767.`;

    let notified = 0;
    for (const contact of contacts.results) {
      try {
        await sendSMS(env, contact.phone, smsBody);
        notified++;
      } catch (_) {}
    }

    await env.DB.prepare(
      'INSERT INTO notifications (user_id, contacts_notified, caller_number, status) VALUES (?, ?, ?, ?)'
    ).bind(user.id, notified, params.get('Caller') || null, 'sent').run();

    return twiml(`<Say voice="alice">Done. We've notified ${notified} of your contacts. Stay calm and ask for a lawyer before any interview. Good luck.</Say>`);
  }

  // POST /api/waitlist
  if (path === '/api/waitlist' && request.method === 'POST') {
    const { email, name } = await request.json();
    if (!email || !email.includes('@')) return json({ error: 'Valid email required.' }, 400);
    try {
      await env.DB.prepare(
        'INSERT INTO waitlist (email, name) VALUES (?, ?) ON CONFLICT(email) DO NOTHING'
      ).bind(email.toLowerCase().trim(), name || null).run();
      return json({ ok: true });
    } catch (e) {
      return json({ error: 'Failed to save.' }, 500);
    }
  }

  // GET /api/admin/waitlist
  if (path === '/api/admin/waitlist' && request.method === 'GET') {
    const token = request.headers.get('Authorization');
    if (token !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: 'Forbidden' }, 403);
    const rows = await env.DB.prepare('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 100').all();
    return json(rows.results);
  }

  return json({ error: 'Not found.' }, 404);
}

// --- Helpers ---

async function hashValue(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value + 'radical_1800_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyHash(value, stored) {
  return (await hashValue(value)) === stored;
}

function twiml(content) {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${content}</Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  );
}

async function sendSMS(env, to, body) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    console.log(`[SMS stub] To: ${to} | Body: ${body}`);
    return;
  }
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: env.TWILIO_FROM_NUMBER, Body: body }),
    }
  );
  if (!res.ok) throw new Error(`Twilio error: ${res.status}`);
}

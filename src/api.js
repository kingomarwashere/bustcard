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

  // --- IVR FLOW ---
  // Step 1: Entry — collect mobile number
  if (path === '/api/ivr/gather' && request.method === 'POST') {
    return twiml(`
      <Gather input="dtmf" numDigits="10" action="/api/ivr/dob" method="POST" timeout="12">
        <Say voice="alice" language="en-AU">Welcome to 1800 Radical. Enter your 10 digit mobile number, starting with zero.</Say>
      </Gather>
      <Say voice="alice" language="en-AU">We didn't receive your mobile number. Please call back.</Say>
    `);
  }

  // Step 2: Collect date of birth
  if (path === '/api/ivr/dob' && request.method === 'POST') {
    const params = new URLSearchParams(await request.text());
    const mobile = params.get('Digits');
    return twiml(`
      <Gather input="dtmf" numDigits="6" action="/api/ivr/verify?mobile=${encodeURIComponent(mobile)}" method="POST" timeout="12">
        <Say voice="alice" language="en-AU">Now enter your date of birth as 6 digits — day, month, year. For example, the 5th of March 1990 would be 0 5 0 3 9 0.</Say>
      </Gather>
      <Say voice="alice" language="en-AU">We didn't receive your date of birth. Please call back.</Say>
    `);
  }

  // Step 3: Verify identity, then ask for location
  if (path === '/api/ivr/verify' && request.method === 'POST') {
    const params = new URLSearchParams(await request.text());
    const dob = params.get('Digits');
    const mobileRaw = url.searchParams.get('mobile');

    if (!mobileRaw || !dob)
      return twiml('<Say voice="alice" language="en-AU">Sorry, we could not verify your details. Please call back.</Say>');

    const mobile = mobileRaw.replace(/^0/, '+61');

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE phone = ? AND active = 1'
    ).bind(mobile).first();

    if (!user)
      return twiml('<Say voice="alice" language="en-AU">Mobile number not found. Please register at busted dot the radical party dot com.</Say>');

    const dobValid = await verifyHash(dob, user.dob_hash);
    if (!dobValid)
      return twiml('<Say voice="alice" language="en-AU">Date of birth did not match. Please try again.</Say>');

    // Verified — ask where they are being held
    return twiml(`
      <Gather input="speech dtmf" action="/api/ivr/location?mobile=${encodeURIComponent(mobileRaw)}" method="POST" timeout="8" speechTimeout="auto" language="en-AU">
        <Say voice="alice" language="en-AU">Verified. Say the name of the police station or location where you are being held, then press any key.</Say>
      </Gather>
      <Say voice="alice" language="en-AU">No location received. We'll notify your contacts now without a location.</Say>
      <Redirect method="POST">/api/ivr/complete?mobile=${encodeURIComponent(mobileRaw)}&loc=unknown</Redirect>
    `);
  }

  // Step 4: Collect optional voice message, location now known
  if (path === '/api/ivr/location' && request.method === 'POST') {
    const params = new URLSearchParams(await request.text());
    const location = params.get('SpeechResult') || 'unknown';
    const mobile = url.searchParams.get('mobile');
    const locEnc = encodeURIComponent(location);

    return twiml(`
      <Gather input="speech dtmf" action="/api/ivr/complete?mobile=${encodeURIComponent(mobile)}&loc=${locEnc}" method="POST" timeout="8" speechTimeout="auto" language="en-AU">
        <Say voice="alice" language="en-AU">Got it. Say a short message for your contacts, then press any key. Or just press any key now to send without a message.</Say>
      </Gather>
      <Redirect method="POST">/api/ivr/complete?mobile=${encodeURIComponent(mobile)}&loc=${locEnc}</Redirect>
    `);
  }

  // Step 5: Fire SMS to all contacts
  if (path === '/api/ivr/complete' && request.method === 'POST') {
    const params = new URLSearchParams(await request.text());
    const voiceMsg = params.get('SpeechResult') || '';
    const mobileRaw = url.searchParams.get('mobile');
    const location = decodeURIComponent(url.searchParams.get('loc') || 'unknown');

    const mobile = mobileRaw?.replace(/^0/, '+61');

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE phone = ? AND active = 1'
    ).bind(mobile).first();

    if (!user)
      return twiml('<Say voice="alice" language="en-AU">Account not found. Please call back.</Say>');

    const contacts = await env.DB.prepare(
      'SELECT * FROM contacts WHERE user_id = ? ORDER BY sort_order'
    ).bind(user.id).all();

    if (!contacts.results?.length)
      return twiml('<Say voice="alice" language="en-AU">No contacts on your account. Please update them at busted dot the radical party dot com.</Say>');

    const now = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });

    const locationLine = location && location !== 'unknown'
      ? `Location: ${location}. `
      : '';

    const messageLine = voiceMsg
      ? `Their message: "${voiceMsg}" `
      : '';

    const smsBody =
      `URGENT: ${user.name} has been detained and asked you to be notified. ` +
      `${locationLine}` +
      `Time: ${now} AEST. ` +
      `${messageLine}` +
      `They cannot be reached. Legal help: contact Legal Aid in your state or call 1300 888 529 (NSW) · Aboriginal Legal Service 1800 765 767.`;

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

    return twiml(`<Say voice="alice" language="en-AU">Done. We've notified ${notified} of your contacts with your location and message. Stay calm and ask for a lawyer before any interview. Good luck.</Say>`);
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
  if (!env.TELNYX_API_KEY || !env.TELNYX_FROM_NUMBER) {
    console.log(`[SMS stub] To: ${to} | Body: ${body}`);
    return;
  }
  const res = await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TELNYX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.TELNYX_FROM_NUMBER,
      to,
      text: body,
    }),
  });
  if (!res.ok) throw new Error(`Telnyx SMS error: ${res.status}`);
}

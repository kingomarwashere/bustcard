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
      const emailClean = email.toLowerCase().trim();
      const alreadyPaid = await env.DB.prepare(
        'SELECT 1 FROM lifetime_purchasers WHERE email = ?'
      ).bind(emailClean).first();
      const plan = alreadyPaid ? 'lifetime' : 'free';

      const result = await env.DB.prepare(
        'INSERT INTO users (name, email, phone, dob_hash, plan) VALUES (?, ?, ?, ?, ?)'
      ).bind(name, emailClean, cleanPhone, dobHash, plan).run();

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
        <Say voice="alice" language="en-AU">Welcome to 1800 BUSTED. Enter your 10 digit mobile number, starting with zero.</Say>
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

  // POST /api/deadman/set — set a deadman switch
  if (path === '/api/deadman/set' && request.method === 'POST') {
    const { phone, dob, fires_at, location, message } = await request.json();
    if (!phone || !dob || !fires_at) return json({ error: 'Mobile, date of birth and fire time required.' }, 400);

    const mobile = phone.replace(/\s+/g, '').replace(/^0/, '+61');
    const user = await env.DB.prepare('SELECT * FROM users WHERE phone = ? AND active = 1').bind(mobile).first();
    if (!user) return json({ error: 'Account not found.' }, 404);

    const dobValid = await verifyHash(dob, user.dob_hash);
    if (!dobValid) return json({ error: 'Date of birth did not match.' }, 403);

    const firesAt = new Date(fires_at);
    if (isNaN(firesAt) || firesAt <= new Date()) return json({ error: 'Fire time must be in the future.' }, 400);

    // Cancel any existing active switch first
    await env.DB.prepare(
      'UPDATE deadman_switches SET cancelled = 1 WHERE user_id = ? AND cancelled = 0 AND fired = 0'
    ).bind(user.id).run();

    const cancelToken = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO deadman_switches (user_id, fires_at, location, message, cancel_token) VALUES (?, ?, ?, ?, ?)'
    ).bind(user.id, firesAt.toISOString(), location || null, message || null, cancelToken).run();

    // Send cancel link to user's own number
    const cancelUrl = `https://busted.theradicalparty.com/cancel/${cancelToken}`;
    const mins = Math.round((firesAt - new Date()) / 60000);
    const smsToUser = `1800 BUSTED: Your deadman switch is set. If not cancelled, your contacts will be alerted in ${mins} minutes. Cancel here: ${cancelUrl}`;
    try { await sendSMS(env, mobile, smsToUser); } catch (_) {}

    return json({ ok: true, fires_at: firesAt.toISOString(), cancel_url: cancelUrl });
  }

  // POST /api/deadman/cancel — cancel by token
  if (path === '/api/deadman/cancel' && request.method === 'POST') {
    const { token } = await request.json();
    if (!token) return json({ error: 'Token required.' }, 400);
    const sw = await env.DB.prepare('SELECT * FROM deadman_switches WHERE cancel_token = ?').bind(token).first();
    if (!sw) return json({ error: 'Switch not found.' }, 404);
    if (sw.fired) return json({ error: 'Already fired.' }, 409);
    if (sw.cancelled) return json({ ok: true, message: 'Already cancelled.' });
    await env.DB.prepare('UPDATE deadman_switches SET cancelled = 1 WHERE cancel_token = ?').bind(token).run();
    return json({ ok: true });
  }

  // GET /api/deadman/status?phone=&dob=
  if (path === '/api/deadman/status' && request.method === 'GET') {
    const phone = url.searchParams.get('phone');
    const dob = url.searchParams.get('dob');
    if (!phone || !dob) return json({ error: 'Phone and dob required.' }, 400);
    const mobile = phone.replace(/\s+/g, '').replace(/^0/, '+61');
    const user = await env.DB.prepare('SELECT * FROM users WHERE phone = ? AND active = 1').bind(mobile).first();
    if (!user) return json({ error: 'Account not found.' }, 404);
    const dobValid = await verifyHash(dob, user.dob_hash);
    if (!dobValid) return json({ error: 'Date of birth did not match.' }, 403);
    const active = await env.DB.prepare(
      'SELECT * FROM deadman_switches WHERE user_id = ? AND cancelled = 0 AND fired = 0 ORDER BY created_at DESC LIMIT 1'
    ).bind(user.id).first();
    return json({ active: !!active, switch: active || null });
  }

  // POST /api/lawyer/register
  if (path === '/api/lawyer/register' && request.method === 'POST') {
    const { name, firm, email, phone } = await request.json();
    if (!name || !email || !phone) return json({ error: 'Name, email and mobile required.' }, 400);
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^0/, '+61');
    const token = crypto.randomUUID().replace(/-/g, '');
    try {
      await env.DB.prepare(
        'INSERT INTO lawyers (name, firm, email, phone, token) VALUES (?, ?, ?, ?, ?)'
      ).bind(name, firm || null, email.toLowerCase().trim(), cleanPhone, token).run();
      const url = `https://busted.theradicalparty.com/lawyer/${token}`;
      return json({ ok: true, url, token });
    } catch (e) {
      if (e.message?.includes('UNIQUE')) return json({ error: 'That email is already registered as a lawyer account.' }, 409);
      return json({ error: 'Failed to create lawyer account.' }, 500);
    }
  }

  // GET /api/lawyer/:token — fetch lawyer info for client signup page
  if (path.startsWith('/api/lawyer/') && request.method === 'GET') {
    const token = path.replace('/api/lawyer/', '');
    if (!token) return json({ error: 'Token required.' }, 400);
    const lawyer = await env.DB.prepare(
      'SELECT name, firm, phone FROM lawyers WHERE token = ?'
    ).bind(token).first();
    if (!lawyer) return json({ error: 'Lawyer link not found.' }, 404);
    return json(lawyer);
  }

  // POST /api/stripe/webhook — upgrade user plan to lifetime on successful payment
  if (path === '/api/stripe/webhook' && request.method === 'POST') {
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();
    if (env.STRIPE_WEBHOOK_SECRET) {
      const valid = await verifyStripeSignature(body, sig, env.STRIPE_WEBHOOK_SECRET);
      if (!valid) return new Response('Bad signature', { status: 400 });
    }
    const event = JSON.parse(body);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email = (session.customer_details?.email || session.customer_email || '').toLowerCase().trim();
      if (email) {
        // Upgrade existing user if they have an account
        await env.DB.prepare("UPDATE users SET plan = 'lifetime' WHERE email = ?").bind(email).run();
        // Store so they get lifetime if they register later
        await env.DB.prepare(
          "INSERT INTO lifetime_purchasers (email, stripe_session_id) VALUES (?, ?) ON CONFLICT(email) DO NOTHING"
        ).bind(email, session.id).run();
      }
    }
    return new Response('ok', { status: 200 });
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

  // GET /api/admin/users — signups + their contacts
  if (path === '/api/admin/users' && request.method === 'GET') {
    const token = request.headers.get('Authorization');
    if (token !== `Bearer ${env.ADMIN_SECRET}`) return json({ error: 'Forbidden' }, 403);
    const users = await env.DB.prepare(
      'SELECT id, name, email, phone, active, created_at FROM users ORDER BY created_at DESC LIMIT 200'
    ).all();
    const contacts = await env.DB.prepare(
      'SELECT user_id, name, phone, relationship, sort_order FROM contacts ORDER BY user_id, sort_order'
    ).all();
    const contactsByUser = {};
    for (const c of (contacts.results || [])) {
      if (!contactsByUser[c.user_id]) contactsByUser[c.user_id] = [];
      contactsByUser[c.user_id].push(c);
    }
    const result = (users.results || []).map(u => ({
      ...u,
      contacts: contactsByUser[u.id] || [],
    }));
    return json(result);
  }

  return json({ error: 'Not found.' }, 404);
}

// --- Helpers ---

async function verifyStripeSignature(body, sigHeader, secret) {
  if (!sigHeader) return false;
  const parts = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')));
  const t = parts['t'];
  const v1 = parts['v1'];
  if (!t || !v1) return false;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${body}`));
  const computed = Array.from(new Uint8Array(signed)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === v1;
}

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

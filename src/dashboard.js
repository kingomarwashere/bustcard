export function dashboardPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>1800 RADICAL — Set Up Your Number</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --pink: #ff0099;
      --pink-light: #ff66c4;
      --black: #000000;
      --dark: #111111;
      --border: #333333;
      --white: #ffffff;
      --muted: #aaaaaa;
      --success: #11cc77;
      --danger: #ff4444;
    }
    body {
      font-family: 'Roboto Mono', monospace;
      background: var(--black);
      color: var(--white);
      min-height: 100vh;
      padding: 48px 24px 80px;
    }
    a { color: var(--pink); text-decoration: none; }
    a:hover { color: var(--pink-light); }

    .container { max-width: 680px; margin: 0 auto; }

    /* NAV */
    .top-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 56px;
    }
    .logo { font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; }
    .logo span { color: var(--pink); }
    .back-link { font-size: 0.75rem; color: var(--muted); }
    .back-link:hover { color: var(--white); }

    /* STEP INDICATOR */
    .steps-indicator {
      display: flex;
      gap: 0;
      margin-bottom: 48px;
      border: 1px solid var(--border);
    }
    .step-ind {
      flex: 1;
      padding: 12px 16px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      border-right: 1px solid var(--border);
      text-align: center;
    }
    .step-ind:last-child { border-right: none; }
    .step-ind.active { color: var(--pink); background: rgba(255,0,153,0.05); }
    .step-ind.done { color: var(--success); }

    /* CARD */
    .card {
      border: 1px solid var(--border);
      padding: 32px;
      margin-bottom: 20px;
    }
    .card.highlight { border-color: var(--pink); }
    .card-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--pink);
      margin-bottom: 20px;
    }

    /* FORMS */
    .field { margin-bottom: 16px; }
    .field label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
      margin-bottom: 6px;
      font-weight: 600;
    }
    .field input {
      width: 100%;
      background: var(--dark);
      border: 1px solid var(--border);
      color: var(--white);
      padding: 12px 14px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.9rem;
      outline: none;
      font-weight: 400;
    }
    .field input:focus { border-color: var(--pink); }
    .field input::placeholder { color: #555555; }
    .field-hint {
      font-size: 0.7rem;
      color: #555555;
      margin-top: 5px;
      font-weight: 400;
    }

    /* CONTACTS */
    .contact-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1.5fr auto;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }
    .contact-row input {
      background: var(--dark);
      border: 1px solid var(--border);
      color: var(--white);
      padding: 10px 12px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      outline: none;
      width: 100%;
    }
    .contact-row input:focus { border-color: var(--pink); }
    .contact-row input::placeholder { color: #555555; }
    .remove-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 10px 12px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      cursor: pointer;
      line-height: 1;
    }
    .remove-btn:hover { border-color: var(--danger); color: var(--danger); }
    .add-row-btn {
      background: transparent;
      border: 1px dashed var(--border);
      color: var(--muted);
      padding: 10px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.75rem;
      cursor: pointer;
      width: 100%;
      margin-top: 8px;
      letter-spacing: 0.05em;
    }
    .add-row-btn:hover { border-color: var(--pink); color: var(--pink); }
    .contacts-header {
      display: grid;
      grid-template-columns: 2fr 2fr 1.5fr auto;
      gap: 8px;
      margin-bottom: 8px;
    }
    .contacts-header span {
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #555555;
    }

    /* BUTTONS */
    .btn {
      background: var(--pink);
      color: var(--black);
      border: none;
      padding: 14px 28px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.05em;
      width: 100%;
      margin-top: 8px;
    }
    .btn:hover { background: var(--pink-light); }
    .btn:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }

    /* MSG */
    .msg {
      margin-top: 14px;
      font-size: 0.8rem;
      min-height: 18px;
      font-weight: 400;
    }
    .msg.ok { color: var(--success); }
    .msg.err { color: var(--danger); }

    /* SUCCESS SCREEN */
    #success-section { display: none; }
    #success-section.show { display: block; }
    #form-section.hide { display: none; }

    .success-header {
      border: 1px solid var(--success);
      padding: 24px;
      margin-bottom: 24px;
      background: rgba(17,204,119,0.05);
    }
    .success-header .label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--success);
      margin-bottom: 8px;
    }
    .success-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .success-header p {
      font-size: 0.8rem;
      color: var(--muted);
      font-weight: 400;
    }

    .member-block {
      border: 1px solid var(--pink);
      padding: 28px;
      margin-bottom: 20px;
      text-align: center;
    }
    .member-block .mb-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
      margin-bottom: 12px;
    }
    .member-block .mb-num {
      font-size: 3.5rem;
      font-weight: 700;
      color: var(--pink);
      letter-spacing: 0.15em;
      line-height: 1;
      margin-bottom: 12px;
    }
    .member-block .mb-hint {
      font-size: 0.75rem;
      color: var(--muted);
      font-weight: 400;
      line-height: 1.6;
    }
    .member-block .mb-hint strong { color: var(--white); }

    .contacts-list-final { list-style: none; }
    .contacts-list-final li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
    }
    .contacts-list-final li:last-child { border-bottom: none; }
    .contacts-list-final .c-name { font-weight: 600; }
    .contacts-list-final .c-info { color: var(--muted); font-size: 0.78rem; font-weight: 400; }
    .contacts-list-final .c-badge {
      font-size: 0.65rem;
      color: var(--success);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .call-block {
      background: var(--dark);
      border: 1px solid var(--border);
      padding: 24px;
      margin-bottom: 20px;
    }
    .call-block .cb-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .call-block .cb-num {
      font-size: 1.6rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .call-block .cb-num span { color: var(--pink); }
    .call-block p {
      font-size: 0.78rem;
      color: var(--muted);
      margin-top: 8px;
      line-height: 1.6;
      font-weight: 400;
    }

    @media (max-width: 600px) {
      body { padding: 32px 16px 60px; }
      .contact-row { grid-template-columns: 1fr 1fr; }
      .contact-row input:nth-child(3) { grid-column: span 2; }
      .contacts-header { display: none; }
    }
  </style>
</head>
<body>
<div class="container">

  <div class="top-nav">
    <div class="logo"><span>1800</span> RADICAL</div>
    <a href="/" class="back-link">← BACK</a>
  </div>

  <!-- STEP INDICATOR -->
  <div class="steps-indicator">
    <div class="step-ind active" id="ind-1">01 // YOUR DETAILS</div>
    <div class="step-ind" id="ind-2">02 // CONTACTS</div>
    <div class="step-ind" id="ind-3">03 // DONE</div>
  </div>

  <!-- FORM -->
  <div id="form-section">

    <!-- STEP 1: DETAILS -->
    <div id="step-1">
      <div class="card highlight">
        <div class="card-label">// your details</div>
        <div class="field">
          <label>Full name</label>
          <input type="text" id="reg-name" placeholder="Jordan Smith" autocomplete="name" />
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" id="reg-email" placeholder="you@example.com" autocomplete="email" />
          <div class="field-hint">For account recovery only. We don't spam.</div>
        </div>
        <div class="field">
          <label>Mobile number</label>
          <input type="tel" id="reg-phone" placeholder="04xx xxx xxx" autocomplete="tel" />
          <div class="field-hint">This is how you identify yourself when you call. Use the number you know by heart.</div>
        </div>
        <div class="field">
          <label>Date of birth — DDMMYY</label>
          <input type="text" id="reg-dob" placeholder="150690" maxlength="6" inputmode="numeric" />
          <div class="field-hint">6 digits. Day, month, last 2 digits of year. E.g. 15 June 1990 → 150690. Second factor when you call in.</div>
        </div>
      </div>
      <button class="btn" id="next-btn">CONTINUE → ADD CONTACTS</button>
      <div class="msg" id="step1-msg"></div>
    </div>

    <!-- STEP 2: CONTACTS -->
    <div id="step-2" style="display:none;">
      <div class="card highlight">
        <div class="card-label">// emergency contacts — up to 10</div>
        <p style="font-size:0.8rem;color:var(--muted);margin-bottom:20px;font-weight:400;line-height:1.6;">These people get an SMS the moment you dial in. Add family, friends, your lawyer. Tell them in advance they might receive a message from an unknown number — so they don't ignore it.</p>
        <div class="contacts-header">
          <span>NAME</span><span>MOBILE</span><span>RELATIONSHIP</span><span></span>
        </div>
        <div id="contacts-list">
          <!-- rows injected by JS -->
        </div>
        <button class="add-row-btn" id="add-contact-btn">+ ADD ANOTHER CONTACT</button>
      </div>
      <div style="display:flex;gap:12px;margin-top:8px;">
        <button class="btn" id="back-btn" style="background:transparent;border:1px solid var(--border);color:var(--muted);flex:0.4;">← BACK</button>
        <button class="btn" id="submit-btn" style="flex:1;">CREATE MY NUMBER →</button>
      </div>
      <div class="msg" id="step2-msg"></div>
    </div>

  </div>

  <!-- SUCCESS -->
  <div id="success-section">

    <div class="success-header">
      <div class="label">// account created</div>
      <h2>You're set up.</h2>
      <p>Nothing new to memorise. You already know both pieces — your mobile and your date of birth.</p>
    </div>

    <div class="call-block">
      <div class="cb-label">// the number to call if arrested</div>
      <div class="cb-num"><span>1800</span> RADICAL</div>
      <p>Free to call from any phone, including police station phones. Enter your mobile number, then your date of birth when prompted.</p>
    </div>

    <div class="member-block">
      <div class="mb-label">// how you identify yourself</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,0,153,0.3);margin-bottom:16px;">
        <div style="background:var(--black);padding:20px;text-align:center;">
          <div style="font-size:0.6rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:8px;">1. YOUR MOBILE</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--pink);" id="member-phone-display">——</div>
        </div>
        <div style="background:var(--black);padding:20px;text-align:center;">
          <div style="font-size:0.6rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--muted);margin-bottom:8px;">2. YOUR DATE OF BIRTH</div>
          <div style="font-size:1.1rem;font-weight:700;color:var(--pink);">DDMMYY</div>
        </div>
      </div>
      <div class="mb-hint">
        You already know both. No new info to memorise — ever.
      </div>
    </div>

    <div class="card">
      <div class="card-label">// contacts who will be notified</div>
      <ul class="contacts-list-final" id="contacts-final"></ul>
    </div>

    <div class="card" style="border-color:var(--border);">
      <div class="card-label">// legal resources — included in every SMS</div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div>
          <div style="font-size:0.9rem;font-weight:600;">Legal Aid — by state</div>
          <div style="font-size:0.78rem;color:var(--pink);font-weight:700;line-height:1.8;">
            NSW 1300 888 529 · VIC 1300 792 387<br>
            QLD 1300 651 188 · WA 1300 650 579<br>
            SA 1300 366 424 · NT 1800 019 343
          </div>
          <div style="font-size:0.72rem;color:var(--muted);font-weight:400;">Free legal advice, all states</div>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:12px;">
          <div style="font-size:0.9rem;font-weight:600;">Aboriginal Legal Service</div>
          <div style="font-size:0.85rem;color:var(--pink);font-weight:700;">1800 765 767</div>
          <div style="font-size:0.75rem;color:var(--muted);font-weight:400;">24/7 custody line (NSW/ACT) — other states vary</div>
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-top:32px;">
      <a href="/" style="font-size:0.8rem;color:var(--muted);">← BACK TO 1800 RADICAL</a>
    </div>

  </div>

</div>
<script>
  let contactCount = 0;

  function addContactRow(focus) {
    if (contactCount >= 10) return;
    contactCount++;
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.innerHTML =
      '<input type="text" placeholder="Name" class="c-name" />' +
      '<input type="tel" placeholder="04xx xxx xxx" class="c-phone" />' +
      '<input type="text" placeholder="e.g. Mum" class="c-rel" />' +
      '<button class="remove-btn" title="Remove">✕</button>';
    row.querySelector('.remove-btn').addEventListener('click', () => {
      row.remove();
      contactCount--;
    });
    document.getElementById('contacts-list').appendChild(row);
    if (focus) row.querySelector('.c-name').focus();
  }

  // Start with 2 rows
  addContactRow(false);
  addContactRow(false);

  document.getElementById('add-contact-btn').addEventListener('click', () => addContactRow(true));

  // Step 1 → Step 2
  document.getElementById('next-btn').addEventListener('click', () => {
    const msg = document.getElementById('step1-msg');
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const dob = document.getElementById('reg-dob').value.trim();
    if (!name) { msg.textContent = 'Enter your name.'; msg.className = 'msg err'; return; }
    if (!email || !email.includes('@')) { msg.textContent = 'Enter a valid email.'; msg.className = 'msg err'; return; }
    if (!phone) { msg.textContent = 'Enter your mobile number.'; msg.className = 'msg err'; return; }
    if (!/^\\d{6}$/.test(dob)) { msg.textContent = 'Date of birth must be 6 digits — DDMMYY. E.g. 150690.'; msg.className = 'msg err'; return; }
    msg.textContent = '';
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'block';
    document.getElementById('ind-1').className = 'step-ind done';
    document.getElementById('ind-2').className = 'step-ind active';
  });

  // Step 2 → back
  document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-1').style.display = 'block';
    document.getElementById('ind-1').className = 'step-ind active';
    document.getElementById('ind-2').className = 'step-ind';
  });

  // Submit
  document.getElementById('submit-btn').addEventListener('click', async () => {
    const msg = document.getElementById('step2-msg');
    const rows = document.querySelectorAll('#contacts-list .contact-row');
    const contacts = [];
    rows.forEach(r => {
      const n = r.querySelector('.c-name').value.trim();
      const p = r.querySelector('.c-phone').value.trim();
      const rel = r.querySelector('.c-rel').value.trim();
      if (n && p) contacts.push({ name: n, phone: p, relationship: rel });
    });
    if (contacts.length === 0) { msg.textContent = 'Add at least one contact.'; msg.className = 'msg err'; return; }

    const btn = document.getElementById('submit-btn');
    btn.textContent = 'CREATING...'; btn.disabled = true;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('reg-name').value.trim(),
          email: document.getElementById('reg-email').value.trim(),
          phone: document.getElementById('reg-phone').value.trim(),
          dob: document.getElementById('reg-dob').value.trim(),
          contacts,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Show success
        document.getElementById('form-section').style.display = 'none';
        document.getElementById('success-section').style.display = 'block';
        document.getElementById('ind-2').className = 'step-ind done';
        document.getElementById('ind-3').className = 'step-ind active';
        document.getElementById('member-phone-display').textContent = document.getElementById('reg-phone').value.trim();
        const ul = document.getElementById('contacts-final');
        contacts.forEach(c => {
          const li = document.createElement('li');
          li.innerHTML =
            '<div><div class="c-name">' + c.name + '</div><div class="c-info">' + c.phone + (c.relationship ? ' · ' + c.relationship : '') + '</div></div>' +
            '<div class="c-badge">ACTIVE</div>';
          ul.appendChild(li);
        });
      } else {
        msg.textContent = data.error || 'Something went wrong. Try again.';
        msg.className = 'msg err';
      }
    } catch {
      msg.textContent = 'Network error. Try again.';
      msg.className = 'msg err';
    } finally {
      btn.textContent = 'CREATE MY NUMBER →';
      btn.disabled = false;
    }
  });
</script>
</body>
</html>`;
}

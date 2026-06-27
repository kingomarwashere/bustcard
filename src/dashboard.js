export function dashboardPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BustCard — My Account</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --red: #e53e3e; --black: #0a0a0a; --grey: #1a1a1a;
      --grey-mid: #2d2d2d; --white: #f5f5f5; --text-muted: #9a9a9a;
    }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: var(--black); color: var(--white); min-height: 100vh; padding: 40px 24px; }
    .container { max-width: 640px; margin: 0 auto; }
    .logo { font-size: 1.2rem; font-weight: 900; margin-bottom: 48px; }
    .logo span { color: var(--red); }
    h1 { font-size: 2rem; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 32px; }
    .card { background: var(--grey); border: 1px solid var(--grey-mid); border-radius: 12px; padding: 28px; margin-bottom: 20px; }
    .card-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px; }
    .member-num { font-size: 2.5rem; font-weight: 900; letter-spacing: 0.08em; color: var(--red); }
    .tip { font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); padding: 0 0 12px; border-bottom: 1px solid var(--grey-mid); }
    td { padding: 14px 0; border-bottom: 1px solid var(--grey-mid); font-size: 0.9rem; }
    tr:last-child td { border-bottom: none; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-ok { background: rgba(104,211,145,0.15); color: #68d391; }
    .badge-pending { background: rgba(236,201,75,0.15); color: #ecc94b; }
    .setup-form input { display: block; width: 100%; background: var(--black); border: 1px solid var(--grey-mid); color: var(--white); padding: 12px 14px; border-radius: 6px; font-size: 0.9rem; margin-bottom: 12px; outline: none; }
    .setup-form input:focus { border-color: var(--red); }
    .setup-form input::placeholder { color: #4a4a4a; }
    .btn { background: var(--red); color: var(--white); border: none; padding: 12px 24px; font-size: 0.9rem; font-weight: 700; border-radius: 6px; cursor: pointer; width: 100%; }
    .btn:hover { background: #c53030; }
    .msg { margin-top: 12px; font-size: 0.85rem; min-height: 20px; }
    .msg.ok { color: #68d391; }
    .msg.err { color: var(--red); }
    .contact-row { display: flex; gap: 8px; margin-bottom: 8px; }
    .contact-row input { flex: 1; background: var(--black); border: 1px solid var(--grey-mid); color: var(--white); padding: 10px 12px; border-radius: 6px; font-size: 0.85rem; outline: none; }
    .contact-row input:focus { border-color: var(--red); }
    .contact-row input::placeholder { color: #4a4a4a; }
    .add-contact-btn { background: transparent; border: 1px dashed var(--grey-mid); color: var(--text-muted); padding: 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; width: 100%; margin-top: 8px; }
    .add-contact-btn:hover { border-color: var(--white); color: var(--white); }
    #register-section, #dashboard-section { display: none; }
    #register-section.show, #dashboard-section.show { display: block; }
  </style>
</head>
<body>
<div class="container">
  <div class="logo">Bust<span>Card</span></div>

  <!-- REGISTER -->
  <div id="register-section" class="show">
    <h1>Set up your BustCard</h1>

    <div class="card">
      <div class="card-label">Your details</div>
      <div class="setup-form">
        <input type="text" id="reg-name" placeholder="Full name" />
        <input type="email" id="reg-email" placeholder="Email address" />
        <input type="tel" id="reg-phone" placeholder="Mobile (optional)" />
        <input type="password" id="reg-pin" placeholder="Choose a 4–8 digit PIN" maxlength="8" />
      </div>
    </div>

    <div class="card">
      <div class="card-label">Emergency contacts — up to 10</div>
      <div id="contacts-list">
        <div class="contact-row">
          <input type="text" placeholder="Name" class="c-name" />
          <input type="tel" placeholder="Mobile" class="c-phone" />
          <input type="text" placeholder="Relationship" class="c-rel" style="flex:0.6;" />
        </div>
      </div>
      <button class="add-contact-btn" id="add-contact">+ Add another contact</button>
    </div>

    <button class="btn" id="register-btn">Create my BustCard</button>
    <div class="msg" id="reg-msg"></div>
  </div>

  <!-- DASHBOARD -->
  <div id="dashboard-section">
    <h1>Your BustCard</h1>

    <div class="card">
      <div class="card-label">Your member number — memorise this</div>
      <div class="member-num" id="dash-member-num">——</div>
      <div class="tip">Call <strong style="color:white;">1800 BUSTED</strong>, enter this number, then your PIN.</div>
    </div>

    <div class="card">
      <div class="card-label">Contacts who get notified</div>
      <table>
        <thead><tr><th>Name</th><th>Mobile</th><th>Relationship</th><th>Status</th></tr></thead>
        <tbody id="dash-contacts"></tbody>
      </table>
    </div>
  </div>

</div>
<script>
  let contactCount = 1;
  document.getElementById('add-contact').addEventListener('click', () => {
    if (contactCount >= 10) return;
    contactCount++;
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.innerHTML = '<input type="text" placeholder="Name" class="c-name" /><input type="tel" placeholder="Mobile" class="c-phone" /><input type="text" placeholder="Relationship" class="c-rel" style="flex:0.6;" />';
    document.getElementById('contacts-list').appendChild(row);
  });

  document.getElementById('register-btn').addEventListener('click', async () => {
    const msg = document.getElementById('reg-msg');
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pin = document.getElementById('reg-pin').value.trim();

    const rows = document.querySelectorAll('#contacts-list .contact-row');
    const contacts = [];
    rows.forEach(r => {
      const n = r.querySelector('.c-name').value.trim();
      const p = r.querySelector('.c-phone').value.trim();
      const rel = r.querySelector('.c-rel').value.trim();
      if (n && p) contacts.push({ name: n, phone: p, relationship: rel });
    });

    if (!name || !email || !pin) { msg.textContent = 'Name, email and PIN are required.'; msg.className = 'msg err'; return; }
    if (contacts.length === 0) { msg.textContent = 'Add at least one contact.'; msg.className = 'msg err'; return; }

    const btn = document.getElementById('register-btn');
    btn.textContent = 'Creating...'; btn.disabled = true;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, pin, contacts }),
      });
      const data = await res.json();
      if (res.ok) {
        document.getElementById('register-section').classList.remove('show');
        document.getElementById('dashboard-section').classList.add('show');
        document.getElementById('dash-member-num').textContent = data.memberNumber;
        const tbody = document.getElementById('dash-contacts');
        contacts.forEach(c => {
          const tr = document.createElement('tr');
          tr.innerHTML = '<td>' + c.name + '</td><td>' + c.phone + '</td><td>' + (c.relationship || '—') + '</td><td><span class="badge badge-ok">Active</span></td>';
          tbody.appendChild(tr);
        });
      } else {
        msg.textContent = data.error || 'Something went wrong.';
        msg.className = 'msg err';
      }
    } catch {
      msg.textContent = 'Network error. Try again.';
      msg.className = 'msg err';
    } finally {
      btn.textContent = 'Create my BustCard';
      btn.disabled = false;
    }
  });
</script>
</body>
</html>`;
}

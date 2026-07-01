export function accountPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>1800 BUSTED — My Account</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --pink: #ff0099; --pink-light: #ff66c4;
      --black: #000; --dark: #111; --border: #333;
      --white: #fff; --muted: #aaa; --success: #11cc77; --danger: #ff4444;
    }
    body { font-family: 'Roboto Mono', monospace; background: var(--black); color: var(--white); min-height: 100vh; padding: 0 0 80px; }

    /* NAV */
    nav { position: sticky; top: 0; z-index: 10; background: rgba(0,0,0,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 0.95rem; font-weight: 700; letter-spacing: 0.05em; }
    .logo span { color: var(--pink); }
    .nav-right { display: flex; align-items: center; gap: 16px; }
    .nav-name { font-size: 0.72rem; color: var(--muted); }
    .signout-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 7px 14px; font-family: 'Roboto Mono', monospace; font-size: 0.72rem; cursor: pointer; letter-spacing: 0.05em; }
    .signout-btn:hover { border-color: var(--danger); color: var(--danger); }

    .container { max-width: 720px; margin: 0 auto; padding: 40px 24px 0; }

    /* CALL BLOCK */
    .call-block { background: var(--dark); border: 1px solid var(--border); padding: 20px 24px; margin-bottom: 36px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .call-block .cb-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--muted); margin-bottom: 4px; }
    .call-block .cb-num { font-size: 1.4rem; font-weight: 700; letter-spacing: 0.05em; }
    .call-block .cb-num span { color: var(--pink); }
    .id-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .id-pill { border: 1px solid var(--border); padding: 8px 16px; text-align: center; }
    .id-pill .ip-label { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 3px; }
    .id-pill .ip-val { font-size: 0.9rem; font-weight: 700; color: var(--pink); }

    /* SECTION */
    .section { margin-bottom: 40px; }
    .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
    .section-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--pink); font-weight: 600; }
    .section-action { font-size: 0.7rem; color: var(--muted); cursor: pointer; background: none; border: none; font-family: 'Roboto Mono', monospace; padding: 0; }
    .section-action:hover { color: var(--white); }

    /* CONTACTS */
    .contact-row { display: grid; grid-template-columns: 2fr 2fr 1.5fr auto; gap: 8px; margin-bottom: 8px; align-items: center; }
    .contact-row input { background: var(--dark); border: 1px solid var(--border); color: var(--white); padding: 10px 12px; font-family: 'Roboto Mono', monospace; font-size: 0.82rem; outline: none; width: 100%; }
    .contact-row input:focus { border-color: var(--pink); }
    .contact-row input::placeholder { color: #555; }
    .remove-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 10px 12px; font-family: 'Roboto Mono', monospace; font-size: 0.8rem; cursor: pointer; }
    .remove-btn:hover { border-color: var(--danger); color: var(--danger); }
    .contacts-header { display: grid; grid-template-columns: 2fr 2fr 1.5fr auto; gap: 8px; margin-bottom: 6px; }
    .contacts-header span { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.1em; color: #555; }
    .add-row-btn { background: transparent; border: 1px dashed var(--border); color: var(--muted); padding: 9px; font-family: 'Roboto Mono', monospace; font-size: 0.72rem; cursor: pointer; width: 100%; margin-top: 8px; letter-spacing: 0.05em; }
    .add-row-btn:hover { border-color: var(--pink); color: var(--pink); }

    /* BUTTONS */
    .btn-save { background: var(--pink); color: var(--black); border: none; padding: 11px 24px; font-family: 'Roboto Mono', monospace; font-size: 0.82rem; font-weight: 700; cursor: pointer; letter-spacing: 0.05em; margin-top: 12px; }
    .btn-save:hover { background: var(--pink-light); }
    .btn-save:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }
    .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 11px 24px; font-family: 'Roboto Mono', monospace; font-size: 0.82rem; cursor: pointer; letter-spacing: 0.05em; }
    .btn-ghost:hover { border-color: var(--white); color: var(--white); }

    /* MSG */
    .msg { font-size: 0.78rem; margin-top: 10px; min-height: 16px; }
    .msg.ok { color: var(--success); }
    .msg.err { color: var(--danger); }

    /* DEADMAN */
    .dm-quick { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 6px 12px; font-family: 'Roboto Mono', monospace; font-size: 0.7rem; font-weight: 700; cursor: pointer; letter-spacing: 0.05em; }
    .dm-quick:hover { border-color: var(--pink); color: var(--pink); }
    .dm-quick.selected { border-color: var(--pink); color: var(--pink); background: rgba(255,0,153,0.08); }
    input[type="datetime-local"] { width: 100%; background: var(--dark); border: 1px solid var(--border); color: var(--white); padding: 11px 13px; font-family: 'Roboto Mono', monospace; font-size: 0.9rem; outline: none; color-scheme: dark; margin-bottom: 10px; }
    input[type="datetime-local"]:focus { border-color: var(--pink); }
    .dm-field input[type="text"] { width: 100%; background: var(--dark); border: 1px solid var(--border); color: var(--white); padding: 11px 13px; font-family: 'Roboto Mono', monospace; font-size: 0.85rem; outline: none; margin-bottom: 10px; }
    .dm-field input[type="text"]:focus { border-color: var(--pink); }
    .dm-field input::placeholder { color: #555; }
    .dm-field label { display: block; font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 5px; }

    .armed-box { border: 1px solid var(--pink); background: rgba(255,0,153,0.05); padding: 20px; margin-bottom: 16px; }
    .armed-label { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--pink); margin-bottom: 6px; }
    .armed-time { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
    .armed-sub { font-size: 0.72rem; color: var(--muted); }
    #dm-countdown { font-size: 2.4rem; font-weight: 700; color: var(--pink); text-align: center; padding: 16px 0; letter-spacing: 0.05em; }
    .btn-cancel-dm { background: transparent; border: 1px solid var(--danger); color: var(--danger); padding: 11px 24px; font-family: 'Roboto Mono', monospace; font-size: 0.82rem; cursor: pointer; width: 100%; letter-spacing: 0.05em; }
    .btn-cancel-dm:hover { background: rgba(255,68,68,0.08); }

    /* HISTORY */
    .history-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #1a1a1a; gap: 16px; }
    .history-row:last-child { border-bottom: none; }
    .history-type { font-size: 0.72rem; font-weight: 700; }
    .history-type.deadman { color: var(--danger); }
    .history-type.sent { color: var(--pink); }
    .history-meta { font-size: 0.72rem; color: var(--muted); margin-top: 3px; }
    .history-badge { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 8px; border: 1px solid var(--border); color: var(--muted); white-space: nowrap; }

    /* LOADING */
    #loading { text-align: center; padding: 80px 0; color: var(--muted); font-size: 0.85rem; letter-spacing: 0.1em; }

    @media (max-width: 600px) {
      nav { padding: 12px 16px; }
      .container { padding: 28px 16px 0; }
      .contact-row { grid-template-columns: 1fr 1fr; }
      .contact-row input:nth-child(3) { grid-column: span 2; }
      .contacts-header { display: none; }
      .call-block { flex-direction: column; }
    }
  </style>
</head>
<body>

<nav>
  <div class="logo"><span>1800</span> BUSTED</div>
  <div class="nav-right">
    <span class="nav-name" id="nav-name"></span>
    <button class="signout-btn" id="signout-btn">SIGN OUT</button>
  </div>
</nav>

<div class="container">
  <div id="loading">// loading your account...</div>
  <div id="content" style="display:none;">

    <!-- CALL REMINDER -->
    <div class="call-block">
      <div>
        <div class="cb-label">// the number to call if arrested</div>
        <div class="cb-num"><span>1800</span> BUSTED</div>
      </div>
      <div class="id-pills">
        <div class="id-pill">
          <div class="ip-label">1. Your mobile</div>
          <div class="ip-val" id="pill-phone">——</div>
        </div>
        <div class="id-pill">
          <div class="ip-label">2. Date of birth</div>
          <div class="ip-val">DDMMYY</div>
        </div>
      </div>
    </div>

    <!-- CONTACTS -->
    <div class="section">
      <div class="section-head">
        <div class="section-label">// emergency contacts</div>
      </div>
      <div class="contacts-header">
        <span>NAME</span><span>MOBILE</span><span>RELATIONSHIP</span><span></span>
      </div>
      <div id="contacts-list"></div>
      <button class="add-row-btn" id="add-contact-btn">+ ADD CONTACT</button>
      <br />
      <button class="btn-save" id="save-contacts-btn">SAVE CONTACTS</button>
      <div class="msg" id="contacts-msg"></div>
    </div>

    <!-- DEADMAN SWITCH -->
    <div class="section">
      <div class="section-head">
        <div class="section-label">// deadman switch</div>
      </div>

      <!-- IDLE -->
      <div id="dm-idle">
        <p style="font-size:0.8rem;color:var(--muted);margin-bottom:20px;line-height:1.7;">Set a timer. If you don't cancel before it fires, your contacts are alerted automatically. You get a cancel link by SMS — one tap and you're good.</p>

        <div style="font-size:0.6rem;text-transform:uppercase;letter-spacing:0.12em;color:#555;margin-bottom:8px;">// quick set</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
          <button class="dm-quick" data-mins="30">+30 MIN</button>
          <button class="dm-quick" data-mins="60">+1 HR</button>
          <button class="dm-quick" data-mins="120">+2 HRS</button>
          <button class="dm-quick" data-mins="240">+4 HRS</button>
          <button class="dm-quick" data-mins="480">+8 HRS</button>
          <button class="dm-quick" data-mins="720">+12 HRS</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
          <button class="dm-quick" data-mins="1440">+24 HRS</button>
          <button class="dm-quick" data-mins="2880">+48 HRS</button>
          <button class="dm-quick" data-mins="4320">+72 HRS</button>
          <button class="dm-quick" data-mins="10080">+1 WEEK</button>
          <button class="dm-quick" data-mins="20160">+2 WEEKS</button>
          <button class="dm-quick" data-mins="43200">+1 MONTH</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
          <button class="dm-quick" data-midnight="1">TONIGHT MIDNIGHT</button>
          <button class="dm-quick" data-end-of-week="1">END OF WEEK</button>
        </div>

        <div class="dm-field">
          <label>Fires at</label>
          <input type="datetime-local" id="dm-time" />
        </div>
        <div class="dm-field">
          <label>Location (optional)</label>
          <input type="text" id="dm-location" placeholder="e.g. Newtown Police Station, or 'hiking Mt Kosciuszko'" />
        </div>
        <div class="dm-field">
          <label>Message for contacts (optional)</label>
          <input type="text" id="dm-message" placeholder='e.g. "I was at the protest on George St" or "I flew to Manila"' />
        </div>
        <div class="dm-field">
          <label>Remind me before it fires</label>
          <select id="dm-remind" style="width:100%;background:var(--dark);border:1px solid var(--border);color:var(--white);padding:11px 13px;font-family:'Roboto Mono',monospace;font-size:0.85rem;outline:none;margin-bottom:10px;">
            <option value="auto">Auto (recommended)</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
            <option value="120">2 hours before</option>
            <option value="360">6 hours before</option>
            <option value="720">12 hours before</option>
            <option value="1440">24 hours before</option>
            <option value="4320">3 days before</option>
          </select>
          <div style="font-size:0.68rem;color:#555;margin-top:-6px;margin-bottom:10px;">You'll get an SMS reminder to check in before the switch fires.</div>
        </div>

        <button class="btn-save" id="dm-set-btn">ARM DEADMAN SWITCH →</button>
        <div class="msg" id="dm-msg"></div>
      </div>

      <!-- ARMED -->
      <div id="dm-active" style="display:none;">
        <div class="armed-box">
          <div class="armed-label">// switch armed</div>
          <div class="armed-time" id="dm-fires-display">——</div>
          <div id="dm-remind-display" style="font-size:0.72rem;color:var(--muted);margin-top:4px;"></div>
          <div class="armed-sub" style="margin-top:8px;">Cancel link sent to your mobile. Tap it if you're safe.</div>
        </div>
        <div id="dm-countdown">--:--:--</div>
        <button class="btn-cancel-dm" id="dm-cancel-btn">CANCEL SWITCH</button>
        <div class="msg" id="dm-cancel-msg"></div>
      </div>
    </div>

    <!-- HISTORY -->
    <div class="section">
      <div class="section-head">
        <div class="section-label">// alert history</div>
      </div>
      <div id="history-list">
        <p style="font-size:0.8rem;color:var(--muted);">No alerts sent yet.</p>
      </div>
    </div>

  </div>
</div>

<script>
  const token = localStorage.getItem('busted_token');
  if (!token) { window.location.href = '/login'; }

  let _contactCount = 0;
  let _activeSwitch = null;
  let _countdownInterval = null;
  let _activeCancelToken = null;

  async function api(path, opts = {}) {
    return fetch(path, {
      ...opts,
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    });
  }

  // Load account
  async function loadAccount() {
    try {
      const res = await api('/api/account');
      if (res.status === 401) { localStorage.removeItem('busted_token'); window.location.href = '/login'; return; }
      const data = await res.json();
      render(data);
    } catch {
      document.getElementById('loading').textContent = '// failed to load. refresh to try again.';
    }
  }

  function render(data) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';

    const { user, contacts, active_switch, notifications } = data;

    document.getElementById('nav-name').textContent = user.name;
    document.getElementById('pill-phone').textContent = user.phone;

    // Contacts
    _contactCount = 0;
    document.getElementById('contacts-list').innerHTML = '';
    (contacts || []).forEach(c => addContactRow(c.name, c.phone, c.relationship, false));
    if (!contacts?.length) addContactRow('', '', '', false);

    // Deadman
    const def = new Date(Date.now() + 4 * 60 * 60 * 1000);
    document.getElementById('dm-time').value = toLocalInput(def);
    if (active_switch) {
      _activeSwitch = active_switch;
      _activeCancelToken = active_switch.cancel_token;
      showArmedState(
        new Date(active_switch.fires_at),
        active_switch.remind_at ? new Date(active_switch.remind_at) : null
      );
    }

    // History
    if (notifications?.length) {
      document.getElementById('history-list').innerHTML = notifications.map(n => {
        const date = n.triggered_at
          ? new Date(n.triggered_at).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
          : '—';
        const isDeadman = n.status === 'deadman';
        return '<div class="history-row">' +
          '<div>' +
            '<div class="history-type ' + n.status + '">' + (isDeadman ? 'DEADMAN FIRED' : 'CALL NOTIFICATION') + '</div>' +
            '<div class="history-meta">' + n.contacts_notified + ' contact' + (n.contacts_notified === 1 ? '' : 's') + ' notified · ' + date + '</div>' +
          '</div>' +
          '<div class="history-badge">' + n.status.toUpperCase() + '</div>' +
        '</div>';
      }).join('');
    }
  }

  function addContactRow(name, phone, rel, focus) {
    if (_contactCount >= 10) return;
    _contactCount++;
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.innerHTML =
      '<input type="text" placeholder="Name" class="c-name" value="' + esc(name) + '" />' +
      '<input type="tel" placeholder="04xx xxx xxx" class="c-phone" value="' + esc(phone) + '" />' +
      '<input type="text" placeholder="e.g. Mum" class="c-rel" value="' + esc(rel) + '" />' +
      '<button class="remove-btn" title="Remove">✕</button>';
    row.querySelector('.remove-btn').addEventListener('click', () => { row.remove(); _contactCount--; });
    document.getElementById('contacts-list').appendChild(row);
    if (focus) row.querySelector('.c-name').focus();
  }

  document.getElementById('add-contact-btn').addEventListener('click', () => addContactRow('', '', '', true));

  // Save contacts
  document.getElementById('save-contacts-btn').addEventListener('click', async () => {
    const msg = document.getElementById('contacts-msg');
    const btn = document.getElementById('save-contacts-btn');
    const rows = document.querySelectorAll('#contacts-list .contact-row');
    const contacts = [];
    rows.forEach(r => {
      const n = r.querySelector('.c-name').value.trim();
      const p = r.querySelector('.c-phone').value.trim();
      const rel = r.querySelector('.c-rel').value.trim();
      if (n && p) contacts.push({ name: n, phone: p, relationship: rel });
    });
    if (!contacts.length) { msg.textContent = 'Add at least one contact.'; msg.className = 'msg err'; return; }
    btn.textContent = 'SAVING...'; btn.disabled = true;
    try {
      const res = await api('/api/account/contacts', { method: 'PUT', body: JSON.stringify({ contacts }) });
      const data = await res.json();
      if (res.ok) {
        msg.textContent = '// contacts saved.'; msg.className = 'msg ok';
        setTimeout(() => { msg.textContent = ''; }, 3000);
      } else {
        msg.textContent = data.error || 'Failed to save.'; msg.className = 'msg err';
      }
    } catch {
      msg.textContent = 'Network error.'; msg.className = 'msg err';
    } finally {
      btn.textContent = 'SAVE CONTACTS'; btn.disabled = false;
    }
  });

  // Deadman quick buttons
  document.querySelectorAll('.dm-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dm-quick').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      let t;
      if (btn.dataset.midnight) {
        t = new Date(); t.setHours(23, 59, 0, 0);
        if (t <= new Date()) t.setDate(t.getDate() + 1);
      } else if (btn.dataset.endOfWeek) {
        t = new Date();
        const daysUntilSun = (7 - t.getDay()) % 7 || 7;
        t.setDate(t.getDate() + daysUntilSun);
        t.setHours(23, 59, 0, 0);
      } else {
        t = new Date(Date.now() + parseInt(btn.dataset.mins) * 60000);
      }
      document.getElementById('dm-time').value = toLocalInput(t);
      // Auto-suggest reminder
      const minsUntil = btn.dataset.mins ? parseInt(btn.dataset.mins) : null;
      if (minsUntil) suggestReminder(minsUntil);
    });
  });

  function suggestReminder(minsUntil) {
    const sel = document.getElementById('dm-remind');
    if (sel.value !== 'auto') return; // don't override manual choice
    // Keep on auto — server will calculate the smart default
  }

  // Set switch
  document.getElementById('dm-set-btn').addEventListener('click', async () => {
    const msg = document.getElementById('dm-msg');
    const btn = document.getElementById('dm-set-btn');
    const timeVal = document.getElementById('dm-time').value;
    if (!timeVal) { msg.textContent = 'Pick a time first.'; msg.className = 'msg err'; return; }
    const firesAt = new Date(timeVal);
    if (firesAt <= new Date()) { msg.textContent = 'Fire time must be in the future.'; msg.className = 'msg err'; return; }
    const remindVal = document.getElementById('dm-remind').value;
    const remind_before_minutes = remindVal === 'auto' ? null : parseInt(remindVal);
    btn.textContent = 'ARMING...'; btn.disabled = true;
    try {
      const res = await api('/api/account/deadman/set', {
        method: 'POST',
        body: JSON.stringify({
          fires_at: firesAt.toISOString(),
          location: document.getElementById('dm-location').value.trim() || null,
          message: document.getElementById('dm-message').value.trim() || null,
          remind_before_minutes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        _activeCancelToken = data.cancel_token;
        showArmedState(new Date(data.fires_at), data.remind_at ? new Date(data.remind_at) : null);
        msg.textContent = '';
      } else {
        msg.textContent = data.error || 'Failed to set switch.'; msg.className = 'msg err';
      }
    } catch {
      msg.textContent = 'Network error.'; msg.className = 'msg err';
    } finally {
      btn.textContent = 'ARM DEADMAN SWITCH →'; btn.disabled = false;
    }
  });

  // Cancel switch
  document.getElementById('dm-cancel-btn').addEventListener('click', async () => {
    const msg = document.getElementById('dm-cancel-msg');
    const btn = document.getElementById('dm-cancel-btn');
    btn.textContent = 'CANCELLING...'; btn.disabled = true;
    try {
      const res = await api('/api/account/deadman/cancel', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        clearInterval(_countdownInterval);
        _activeCancelToken = null;
        document.getElementById('dm-active').style.display = 'none';
        document.getElementById('dm-idle').style.display = 'block';
        document.getElementById('dm-msg').textContent = '// switch cancelled.';
        document.getElementById('dm-msg').className = 'msg ok';
        msg.textContent = '';
      } else {
        msg.textContent = data.error || 'Failed to cancel.'; msg.className = 'msg err';
      }
    } catch {
      msg.textContent = 'Network error.'; msg.className = 'msg err';
    } finally {
      btn.textContent = 'CANCEL SWITCH'; btn.disabled = false;
    }
  });

  function showArmedState(firesAt, remindAt) {
    document.getElementById('dm-idle').style.display = 'none';
    document.getElementById('dm-active').style.display = 'block';
    document.getElementById('dm-fires-display').textContent =
      'Fires ' + firesAt.toLocaleString('en-AU', { dateStyle: 'full', timeStyle: 'short' });
    const remindEl = document.getElementById('dm-remind-display');
    if (remindAt && remindAt > new Date()) {
      remindEl.textContent = 'Reminder: ' + remindAt.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
    } else {
      remindEl.textContent = '';
    }
    clearInterval(_countdownInterval);
    _countdownInterval = setInterval(() => {
      const diff = firesAt - Date.now();
      if (diff <= 0) {
        clearInterval(_countdownInterval);
        document.getElementById('dm-countdown').textContent = 'FIRED';
        document.getElementById('dm-countdown').style.color = 'var(--danger)';
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = n => String(n).padStart(2, '0');
      document.getElementById('dm-countdown').textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    }, 1000);
  }

  function toLocalInput(date) {
    const pad = n => String(n).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  document.getElementById('signout-btn').addEventListener('click', () => {
    localStorage.removeItem('busted_token');
    window.location.href = '/';
  });

  loadAccount();
</script>
</body>
</html>`;
}

export function adminPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>1800 BUSTED — Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --pink: #ff0099;
      --black: #000;
      --dark: #111;
      --border: #333;
      --white: #fff;
      --muted: #aaa;
      --success: #11cc77;
      --danger: #ff4444;
    }
    body { font-family: 'Roboto Mono', monospace; background: var(--black); color: var(--white); min-height: 100vh; padding: 40px 24px; }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 4px; }
    h1 span { color: var(--pink); }
    .sub { font-size: 0.75rem; color: var(--muted); margin-bottom: 32px; }

    /* LOGIN */
    #login { max-width: 360px; }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; }
    .field input { width: 100%; background: var(--dark); border: 1px solid var(--border); color: var(--white); padding: 11px 13px; font-family: 'Roboto Mono', monospace; font-size: 0.9rem; outline: none; }
    .field input:focus { border-color: var(--pink); }
    .btn { background: var(--pink); color: var(--black); border: none; padding: 12px 24px; font-family: 'Roboto Mono', monospace; font-size: 0.85rem; font-weight: 700; cursor: pointer; width: 100%; letter-spacing: 0.05em; }
    .btn:hover { opacity: 0.85; }
    .err { font-size: 0.78rem; color: var(--danger); margin-top: 10px; }

    /* DASHBOARD */
    #dash { display: none; }
    .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
    .stats { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 28px; }
    .stat { border: 1px solid var(--border); padding: 16px 24px; }
    .stat .n { font-size: 2rem; font-weight: 700; color: var(--pink); line-height: 1; }
    .stat .l { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-top: 4px; }
    .logout-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 8px 16px; font-family: 'Roboto Mono', monospace; font-size: 0.75rem; cursor: pointer; }
    .logout-btn:hover { border-color: var(--danger); color: var(--danger); }

    /* SEARCH */
    #search { width: 100%; max-width: 360px; background: var(--dark); border: 1px solid var(--border); color: var(--white); padding: 10px 13px; font-family: 'Roboto Mono', monospace; font-size: 0.85rem; outline: none; margin-bottom: 20px; }
    #search:focus { border-color: var(--pink); }

    /* USER CARDS */
    .user-card { border: 1px solid var(--border); margin-bottom: 12px; }
    .user-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 20px 14px; gap: 16px; cursor: pointer; }
    .user-head:hover { background: #0a0a0a; }
    .user-name { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
    .user-meta { font-size: 0.72rem; color: var(--muted); line-height: 1.7; }
    .user-meta a { color: var(--muted); text-decoration: none; }
    .user-meta a:hover { color: var(--pink); }
    .badge { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 8px; border: 1px solid var(--success); color: var(--success); white-space: nowrap; }
    .badge.off { border-color: var(--border); color: var(--muted); }
    .toggle-icon { color: var(--pink); font-size: 1.1rem; line-height: 1; flex-shrink: 0; margin-top: 2px; }
    .contacts-panel { display: none; border-top: 1px solid var(--border); padding: 16px 20px; background: var(--dark); }
    .contacts-panel.open { display: block; }
    .contacts-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--pink); margin-bottom: 12px; }
    .contact-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1a1a1a; font-size: 0.8rem; gap: 16px; }
    .contact-item:last-child { border-bottom: none; }
    .contact-item .cn { font-weight: 600; }
    .contact-item .cp { color: var(--muted); font-size: 0.75rem; }
    .contact-item .cr { font-size: 0.7rem; color: #666; }
    .no-contacts { font-size: 0.78rem; color: var(--muted); }
  </style>
</head>
<body>
<div class="container">
  <h1><span>1800</span> BUSTED — Admin</h1>
  <p class="sub">// signup monitor</p>

  <!-- LOGIN -->
  <div id="login">
    <div class="field">
      <label>Admin password</label>
      <input type="password" id="pwd" placeholder="••••••••" autocomplete="current-password" />
    </div>
    <button class="btn" id="login-btn">SIGN IN →</button>
    <div class="err" id="login-err"></div>
  </div>

  <!-- DASHBOARD -->
  <div id="dash">
    <div class="topbar">
      <div class="stats" id="stats"></div>
      <button class="logout-btn" id="logout-btn">SIGN OUT</button>
    </div>
    <input type="text" id="search" placeholder="Search by name, email or phone..." />
    <div id="user-list"></div>
  </div>
</div>

<script>
  let _token = '';
  let _allUsers = [];

  document.getElementById('pwd').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });

  document.getElementById('login-btn').addEventListener('click', async () => {
    const pwd = document.getElementById('pwd').value.trim();
    if (!pwd) return;
    const err = document.getElementById('login-err');
    err.textContent = '';
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: 'Bearer ' + pwd }
      });
      if (res.status === 403) { err.textContent = 'Wrong password.'; return; }
      if (!res.ok) { err.textContent = 'Server error.'; return; }
      _token = pwd;
      _allUsers = await res.json();
      document.getElementById('login').style.display = 'none';
      document.getElementById('dash').style.display = 'block';
      renderStats();
      renderUsers(_allUsers);
    } catch {
      err.textContent = 'Network error.';
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    _token = '';
    _allUsers = [];
    document.getElementById('dash').style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('pwd').value = '';
    document.getElementById('user-list').innerHTML = '';
  });

  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    if (!q) { renderUsers(_allUsers); return; }
    renderUsers(_allUsers.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    ));
  });

  function renderStats() {
    const total = _allUsers.length;
    const active = _allUsers.filter(u => u.active).length;
    const totalContacts = _allUsers.reduce((s, u) => s + (u.contacts?.length || 0), 0);
    document.getElementById('stats').innerHTML =
      stat(total, 'Total signups') +
      stat(active, 'Active') +
      stat(totalContacts, 'Total contacts');
  }

  function stat(n, label) {
    return '<div class="stat"><div class="n">' + n + '</div><div class="l">' + label + '</div></div>';
  }

  function renderUsers(users) {
    const list = document.getElementById('user-list');
    if (!users.length) { list.innerHTML = '<p style="color:var(--muted);font-size:0.82rem;">No signups yet.</p>'; return; }
    list.innerHTML = users.map((u, i) => {
      const date = u.created_at ? new Date(u.created_at).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
      const contactCount = u.contacts?.length || 0;
      const badge = u.active
        ? '<span class="badge">ACTIVE</span>'
        : '<span class="badge off">INACTIVE</span>';
      const contactRows = contactCount
        ? u.contacts.map(c =>
            '<div class="contact-item">' +
              '<div><div class="cn">' + esc(c.name) + '</div><div class="cp">' + esc(c.phone) + '</div></div>' +
              '<div class="cr">' + esc(c.relationship || '') + '</div>' +
            '</div>'
          ).join('')
        : '<div class="no-contacts">No contacts added.</div>';

      return '<div class="user-card">' +
        '<div class="user-head" onclick="toggle(' + i + ')">' +
          '<div>' +
            '<div class="user-name">' + esc(u.name) + '</div>' +
            '<div class="user-meta">' +
              '<a href="mailto:' + esc(u.email) + '">' + esc(u.email) + '</a> · ' +
              esc(u.phone) + ' · ' +
              contactCount + ' contact' + (contactCount === 1 ? '' : 's') + ' · ' +
              date +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:10px;align-items:center;">' + badge + '<div class="toggle-icon" id="icon-' + i + '">+</div></div>' +
        '</div>' +
        '<div class="contacts-panel" id="panel-' + i + '">' +
          '<div class="contacts-label">// who they want notified</div>' +
          contactRows +
        '</div>' +
      '</div>';
    }).join('');
  }

  function toggle(i) {
    const panel = document.getElementById('panel-' + i);
    const icon = document.getElementById('icon-' + i);
    const open = panel.classList.toggle('open');
    icon.textContent = open ? '−' : '+';
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
</script>
</body>
</html>`;
}

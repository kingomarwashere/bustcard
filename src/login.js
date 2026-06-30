export function loginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>1800 BUSTED — Sign In</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --pink: #ff0099; --pink-light: #ff66c4;
      --black: #000; --dark: #111; --border: #333;
      --white: #fff; --muted: #aaa; --danger: #ff4444;
    }
    body { font-family: 'Roboto Mono', monospace; background: var(--black); color: var(--white); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .wrap { width: 100%; max-width: 400px; }
    .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; }
    .logo { font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; text-decoration: none; color: var(--white); }
    .logo span { color: var(--pink); }
    .back-link { font-size: 0.75rem; color: var(--muted); text-decoration: none; }
    .back-link:hover { color: var(--white); }
    .eyebrow { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--pink); margin-bottom: 12px; }
    h1 { font-size: 1.8rem; font-weight: 700; margin-bottom: 32px; line-height: 1.1; }
    .field { margin-bottom: 16px; }
    .field label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 6px; font-weight: 600; }
    .field input { width: 100%; background: var(--dark); border: 1px solid var(--border); color: var(--white); padding: 13px 14px; font-family: 'Roboto Mono', monospace; font-size: 0.95rem; outline: none; }
    .field input:focus { border-color: var(--pink); }
    .field input::placeholder { color: #555; }
    .field-hint { font-size: 0.68rem; color: #555; margin-top: 5px; }
    .btn { background: var(--pink); color: var(--black); border: none; padding: 14px; font-family: 'Roboto Mono', monospace; font-size: 0.9rem; font-weight: 700; cursor: pointer; width: 100%; margin-top: 8px; letter-spacing: 0.05em; }
    .btn:hover { background: var(--pink-light); }
    .btn:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }
    .msg { font-size: 0.8rem; color: var(--danger); margin-top: 12px; min-height: 18px; }
    .divider { border-top: 1px solid var(--border); margin: 28px 0; }
    .new-user { font-size: 0.78rem; color: var(--muted); text-align: center; }
    .new-user a { color: var(--pink); text-decoration: none; }
    .new-user a:hover { color: var(--pink-light); }
  </style>
</head>
<body>
<div class="wrap">
  <div class="top-nav">
    <a href="/" class="logo"><span>1800</span> BUSTED</a>
    <a href="/" class="back-link">← BACK</a>
  </div>

  <div class="eyebrow">// returning user</div>
  <h1>Sign in.</h1>

  <div class="field">
    <label>Mobile number</label>
    <input type="tel" id="phone" placeholder="04xx xxx xxx" autocomplete="tel" />
  </div>
  <div class="field">
    <label>Date of birth — DDMMYY</label>
    <input type="text" id="dob" placeholder="150690" maxlength="6" inputmode="numeric" />
    <div class="field-hint">Same 6 digits you used when signing up.</div>
  </div>
  <button class="btn" id="signin-btn">SIGN IN →</button>
  <div class="msg" id="msg"></div>

  <div class="divider"></div>
  <div class="new-user">No account? <a href="/dashboard">Set one up free →</a></div>
</div>

<script>
  document.getElementById('dob').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('signin-btn').click();
  });

  document.getElementById('signin-btn').addEventListener('click', async () => {
    const msg = document.getElementById('msg');
    const btn = document.getElementById('signin-btn');
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value.trim();
    if (!phone) { msg.textContent = 'Enter your mobile number.'; return; }
    if (!/^\\d{6}$/.test(dob)) { msg.textContent = 'Date of birth must be 6 digits — DDMMYY.'; return; }
    btn.textContent = 'SIGNING IN...'; btn.disabled = true; msg.textContent = '';
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, dob }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('busted_token', data.token);
        window.location.href = '/account';
      } else {
        msg.textContent = data.error || 'Sign in failed.';
        btn.textContent = 'SIGN IN →'; btn.disabled = false;
      }
    } catch {
      msg.textContent = 'Network error. Try again.';
      btn.textContent = 'SIGN IN →'; btn.disabled = false;
    }
  });
</script>
</body>
</html>`;
}

export function landingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>1800 RADICAL — If you get arrested, who finds out?</title>
  <meta name="description" content="If you get arrested, who finds out? One call. No internet. No memory required. Your people get texted in seconds." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --pink: #ff0099;
      --pink-light: #ff66c4;
      --pink-dark: #cc007a;
      --black: #000000;
      --dark: #111111;
      --border: #333333;
      --white: #ffffff;
      --muted: #aaaaaa;
      --success: #11cc77;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Roboto Mono', monospace;
      background: var(--black);
      color: var(--white);
      line-height: 1.5;
    }

    /* NAV */
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 100;
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo {
      font-size: 1rem;
      font-weight: 700;
      color: var(--white);
      text-decoration: none;
      letter-spacing: 0.05em;
    }
    .nav-logo span { color: var(--pink); }
    .nav-cta {
      background: var(--pink);
      color: var(--black);
      border: none;
      padding: 8px 20px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 0.05em;
    }
    .nav-cta:hover { background: var(--pink-light); }

    /* HERO */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 120px 32px 80px;
      max-width: 960px;
      margin: 0 auto;
    }
    .hero-eyebrow {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--pink);
      margin-bottom: 24px;
    }
    h1 {
      font-size: clamp(2.8rem, 8vw, 7rem);
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.02em;
      margin-bottom: 32px;
    }
    h1 em {
      font-style: normal;
      color: var(--pink);
    }
    .hero-sub {
      font-size: clamp(0.9rem, 2vw, 1.1rem);
      color: var(--muted);
      max-width: 560px;
      margin-bottom: 48px;
      line-height: 1.8;
      font-weight: 400;
    }
    .hero-sub strong { color: var(--white); font-weight: 600; }

    /* NUMBER DISPLAY */
    .number-display {
      display: inline-block;
      border: 1px solid var(--pink);
      padding: 20px 32px;
      margin-bottom: 48px;
    }
    .number-display .nd-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .number-display .nd-num {
      font-size: clamp(1.8rem, 5vw, 3rem);
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--white);
    }
    .number-display .nd-num span { color: var(--pink); }

    /* CTA BUTTONS */
    .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
    .btn-primary {
      background: var(--pink);
      color: var(--black);
      border: none;
      padding: 14px 32px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 0.05em;
      display: inline-block;
      transition: background 0.15s;
    }
    .btn-primary:hover { background: var(--pink-light); }
    .btn-ghost {
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--border);
      padding: 14px 32px;
      font-family: 'Roboto Mono', monospace;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: border-color 0.15s, color 0.15s;
    }
    .btn-ghost:hover { border-color: var(--white); color: var(--white); }

    /* SECTION */
    .section-wrap {
      border-top: 1px solid var(--border);
    }
    section {
      padding: 80px 32px;
      max-width: 960px;
      margin: 0 auto;
    }
    .section-label {
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--pink);
      margin-bottom: 12px;
    }
    h2 {
      font-size: clamp(1.6rem, 4vw, 2.8rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 56px;
      line-height: 1.1;
    }

    /* STEPS */
    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0;
      border: 1px solid var(--border);
    }
    .step {
      padding: 32px;
      border-right: 1px solid var(--border);
    }
    .step:last-child { border-right: none; }
    .step-num {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--pink);
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }
    .step h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: 0.01em;
    }
    .step p {
      font-size: 0.82rem;
      color: var(--muted);
      line-height: 1.7;
      font-weight: 400;
    }

    /* SMS PREVIEW */
    .sms-preview {
      margin-top: 48px;
      border: 1px solid var(--border);
      padding: 28px;
    }
    .sms-preview .sms-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
      margin-bottom: 20px;
    }
    .sms-bubble {
      background: #1a1a2e;
      border: 1px solid #2a2a4e;
      color: white;
      padding: 16px 20px;
      font-size: 0.85rem;
      line-height: 1.6;
      max-width: 420px;
      margin-bottom: 10px;
      font-weight: 400;
    }
    .sms-meta { font-size: 0.7rem; color: var(--muted); }

    /* FOR WHO */
    .for-who-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
    }
    .for-who-card {
      background: var(--black);
      padding: 28px;
    }
    .for-who-card .icon {
      font-size: 1.2rem;
      margin-bottom: 14px;
    }
    .for-who-card h3 {
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
    }
    .for-who-card p {
      font-size: 0.78rem;
      color: var(--muted);
      line-height: 1.6;
      font-weight: 400;
    }

    /* CALLOUT */
    .callout {
      border-left: 3px solid var(--pink);
      padding: 24px 28px;
      background: var(--dark);
      margin: 40px 0;
    }
    .callout p {
      font-size: 0.9rem;
      line-height: 1.8;
      color: var(--muted);
      font-weight: 400;
    }
    .callout p strong { color: var(--white); font-weight: 600; }

    /* WHY GRID */
    .why-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 28px;
    }
    .why-item .check {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .why-item .check-dot {
      width: 6px; height: 6px;
      background: var(--pink);
      flex-shrink: 0;
    }
    .why-item .check span {
      font-size: 0.88rem;
      font-weight: 700;
    }
    .why-item p {
      font-size: 0.78rem;
      color: var(--muted);
      line-height: 1.6;
      padding-left: 16px;
      font-weight: 400;
    }

    /* PRICING */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1px;
      background: var(--border);
      border: 1px solid var(--border);
    }
    .pricing-card {
      background: var(--black);
      padding: 36px;
      display: flex;
      flex-direction: column;
    }
    .pricing-card.featured { background: var(--dark); }
    .pricing-card .tag {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--pink);
      margin-bottom: 12px;
    }
    .pricing-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .price {
      font-size: 2.8rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 4px;
      line-height: 1;
    }
    .price sub {
      font-size: 1rem;
      font-weight: 400;
      color: var(--muted);
      vertical-align: baseline;
    }
    .price-note {
      font-size: 0.72rem;
      color: var(--muted);
      margin-bottom: 28px;
      font-weight: 400;
    }
    .pricing-features {
      list-style: none;
      flex: 1;
      margin-bottom: 28px;
    }
    .pricing-features li {
      font-size: 0.8rem;
      color: var(--muted);
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 400;
    }
    .pricing-features li.on { color: var(--white); }
    .pricing-features li::before {
      content: '';
      width: 5px; height: 5px;
      background: var(--border);
      flex-shrink: 0;
    }
    .pricing-features li.on::before { background: var(--pink); }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-q {
      font-size: 0.9rem;
      font-weight: 600;
      padding: 22px 0;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      letter-spacing: 0.01em;
    }
    .faq-q::after {
      content: '+';
      color: var(--pink);
      font-size: 1.4rem;
      font-weight: 300;
      flex-shrink: 0;
      line-height: 1;
    }
    .faq-q.open::after { content: '−'; }
    .faq-a {
      font-size: 0.82rem;
      color: var(--muted);
      line-height: 1.8;
      display: none;
      padding-bottom: 22px;
      font-weight: 400;
    }
    .faq-a.open { display: block; }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px 32px;
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-logo {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--white);
      letter-spacing: 0.05em;
    }
    .footer-logo span { color: var(--pink); }
    .footer-links { display: flex; gap: 24px; list-style: none; }
    .footer-links a {
      font-size: 0.75rem;
      color: var(--muted);
      text-decoration: none;
    }
    .footer-links a:hover { color: var(--pink); }
    .footer-disclaimer {
      width: 100%;
      font-size: 0.7rem;
      color: #555555;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      margin-top: 8px;
      line-height: 1.6;
      font-weight: 400;
    }

    @media (max-width: 640px) {
      nav { padding: 14px 20px; }
      .hero { padding: 100px 20px 60px; }
      section { padding: 56px 20px; }
      footer { padding: 36px 20px; }
      .step { border-right: none; border-bottom: 1px solid var(--border); }
      .step:last-child { border-bottom: none; }
    }
  </style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="/" class="nav-logo"><span>1800</span> RADICAL</a>
  <a href="/dashboard" class="nav-cta">GET YOUR NUMBER</a>
</nav>

<!-- HERO -->
<div class="hero">
  <div class="hero-eyebrow">// NSW custody notification system</div>
  <h1>If you get arrested,<br>who finds <em>out?</em></h1>
  <p class="hero-sub">
    <strong>One call. No internet. No memory required.</strong><br>
    Your people get texted the moment you dial in — before any interview, from any police station phone.
  </p>
  <div class="number-display">
    <div class="nd-label">// call this number</div>
    <div class="nd-num"><span>1800</span> RADICAL</div>
  </div>
  <div class="hero-ctas">
    <a href="/dashboard" class="btn-primary">SET UP YOUR NUMBER →</a>
    <a href="#how" class="btn-ghost">HOW IT WORKS</a>
  </div>
</div>

<!-- HOW IT WORKS -->
<div class="section-wrap">
<section id="how">
  <div class="section-label">// how it works</div>
  <h2>Three steps. Two minutes.</h2>
  <div class="steps">
    <div class="step">
      <div class="step-num">01 //</div>
      <h3>Sign up + add contacts</h3>
      <p>Add up to 10 people — family, friends, your lawyer. You get a 6-digit member number and a PIN. Write them somewhere physical, not just in your phone.</p>
    </div>
    <div class="step">
      <div class="step-num">02 //</div>
      <h3>If arrested, call 1800 RADICAL</h3>
      <p>Ask to make your phone call. Dial 1800 RADICAL from the station phone — it's free to call and police must let you make it.</p>
    </div>
    <div class="step">
      <div class="step-num">03 //</div>
      <h3>Enter your PIN</h3>
      <p>Key in your member number then your PIN. Everyone on your list gets an SMS within seconds. You don't need to say a word.</p>
    </div>
  </div>

  <div class="sms-preview">
    <div class="sms-label">// what your contacts receive</div>
    <div class="sms-bubble">
      URGENT: Jordan Smith has been detained and asked you to be notified. Time: 11:42 PM AEST. They cannot be reached right now. Legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767.
    </div>
    <div class="sms-meta">// delivered instantly to all contacts on your list</div>
  </div>
</section>
</div>

<!-- WHO IT'S FOR -->
<div class="section-wrap">
<section id="who">
  <div class="section-label">// who it's for</div>
  <h2>If you already know the drill.</h2>

  <div class="callout">
    <p>
      Activists have been writing a lawyer's number on their forearm in sharpie before a direct action for decades. That piece of paper handed out at rallies — legal support line, bail fund number — that's the original bust card. <strong>1800 Radical</strong> is the digital version, built so it works even when your phone is confiscated and your memory has left the building.
    </p>
  </div>

  <div class="for-who-grid">
    <div class="for-who-card">
      <div class="icon">✊</div>
      <h3>Activists + protesters</h3>
      <p>Set this up before you leave the house. Your legal support and family get notified automatically — no sharpie required.</p>
    </div>
    <div class="for-who-card">
      <div class="icon">📋</div>
      <h3>People with a record</h3>
      <p>If you've had police contact before, your phone won't be in your hand when you need it. Plan ahead while you can.</p>
    </div>
    <div class="for-who-card">
      <div class="icon">⚖️</div>
      <h3>Criminal lawyers</h3>
      <p>Give clients a number as part of onboarding. Your after-hours line gets the first notification, automatically.</p>
    </div>
    <div class="for-who-card">
      <div class="icon">🏠</div>
      <h3>Anyone sensible</h3>
      <p>Takes two minutes to set up. Costs nothing to have waiting. You don't have to expect it to prepare for it.</p>
    </div>
  </div>
</section>
</div>

<!-- WHY IT WORKS -->
<div class="section-wrap">
<section>
  <div class="section-label">// why it works</div>
  <h2>Built around how NSW custody actually works.</h2>
  <div class="why-grid">
    <div class="why-item">
      <div class="check"><div class="check-dot"></div><span>1800 = free to call</span></div>
      <p>From a police station phone with no money. An 1800 number costs nothing to dial.</p>
    </div>
    <div class="why-item">
      <div class="check"><div class="check-dot"></div><span>No smartphone needed</span></div>
      <p>Works from any landline. Police can't unlock your phone anyway — this doesn't need it.</p>
    </div>
    <div class="why-item">
      <div class="check"><div class="check-dot"></div><span>Fires before interview</span></div>
      <p>You have the right to a call before questioning. That's exactly when this runs.</p>
    </div>
    <div class="why-item">
      <div class="check"><div class="check-dot"></div><span>Nothing to memorise</span></div>
      <p>One number. One PIN. Write it on your wrist if you have to. That's the whole system.</p>
    </div>
    <div class="why-item">
      <div class="check"><div class="check-dot"></div><span>Legal resources in every SMS</span></div>
      <p>Every alert includes LawAccess NSW and ALS numbers. Your contacts know who to call.</p>
    </div>
    <div class="why-item">
      <div class="check"><div class="check-dot"></div><span>Private by design</span></div>
      <p>We don't record calls. We don't store conversations. Your data is for notification only.</p>
    </div>
  </div>
</section>
</div>

<!-- PRICING -->
<div class="section-wrap">
<section id="pricing">
  <div class="section-label">// plans</div>
  <h2>Simple pricing. No gotchas.</h2>
  <div class="pricing-grid">
    <div class="pricing-card">
      <div class="tag">// free forever</div>
      <h3>BASIC</h3>
      <div class="price">$0</div>
      <div class="price-note">No card required</div>
      <ul class="pricing-features">
        <li class="on">1 member number + PIN</li>
        <li class="on">Up to 3 contacts notified</li>
        <li class="on">SMS alert with legal numbers</li>
        <li>Lawyer auto dial-out</li>
        <li>Protest-day group mode</li>
      </ul>
      <a href="/dashboard" class="btn-ghost" style="text-align:center;">GET STARTED FREE</a>
    </div>
    <div class="pricing-card featured">
      <div class="tag">// full access</div>
      <h3>FULL</h3>
      <div class="price">$4.99<sub>/mo</sub></div>
      <div class="price-note">Or $39/year — save $21</div>
      <ul class="pricing-features">
        <li class="on">1 member number + PIN</li>
        <li class="on">Up to 10 contacts notified</li>
        <li class="on">SMS alert with legal numbers</li>
        <li class="on">Lawyer auto dial-out</li>
        <li class="on">Protest-day group mode</li>
      </ul>
      <a href="/dashboard" class="btn-primary" style="text-align:center;">GET YOUR NUMBER</a>
    </div>
  </div>
</section>
</div>

<!-- FAQ -->
<div class="section-wrap">
<section id="faq">
  <div class="section-label">// questions</div>
  <h2>Common questions.</h2>
  <div class="faq-list">
    <div class="faq-item">
      <div class="faq-q">Can police refuse to let me call 1800 RADICAL?</div>
      <div class="faq-a">Under NSW law you have the right to contact a person to notify them of your arrest. In practice, custody managers have discretion about which numbers they'll dial. An 1800 automated service is a grey area — some officers will dial it, others may insist you call a person directly. If you get resistance, ask for LawAccess or Legal Aid duty lawyer first and let them contact your people. For planned actions, carry 1800 RADICAL <em>and</em> a backup human number.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What exactly does the SMS say?</div>
      <div class="faq-a">Your contacts receive: "[Your name] has been detained and asked you to be notified. Time: [timestamp] AEST. They cannot be reached right now. Legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767." Factual, clear, no drama.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Does this work if I'm sent to prison or remand?</div>
      <div class="faq-a">1800 Radical is designed for the police station stage — the critical first few hours after arrest. Correctional centres use a separate Offender Telephone System that only allows pre-approved numbers. This doesn't work inside prison, but that's not when you need it. The notification happens at the station, before anything else.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do my contacts need to sign up for anything?</div>
      <div class="faq-a">No. They just receive an SMS from an unknown number. Tell them in advance that they might get a message like this, so they know to take it seriously and not dismiss it as spam.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What if I forget my PIN?</div>
      <div class="faq-a">You can reset your PIN by logging into your account online with your email. This is exactly why writing down your member number and PIN physically — not just in your phone — matters. Keep a copy at home and with someone you trust.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is this legal?</div>
      <div class="faq-a">Yes. 1800 Radical is a notification relay service. It sends an SMS on your behalf, nothing more. We don't provide legal advice and we're not a legal service. The SMS contains publicly available numbers — we're just making sure your people have them at the right moment.</div>
    </div>
  </div>
</section>
</div>

<!-- FOOTER -->
<div class="section-wrap">
<footer>
  <div class="footer-logo"><span>1800</span> RADICAL</div>
  <ul class="footer-links">
    <li><a href="#how">HOW IT WORKS</a></li>
    <li><a href="#who">WHO IT'S FOR</a></li>
    <li><a href="#pricing">PRICING</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="https://theradicalparty.com">RADICAL PARTY</a></li>
  </ul>
  <div class="footer-disclaimer">
    1800 Radical is a notification service, not a legal service. Nothing on this site constitutes legal advice. For legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767 · Legal Aid NSW 1300 888 529. &copy; ${new Date().getFullYear()} 1800 Radical — a Radical Party project.
  </div>
</footer>
</div>

<script>
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const isOpen = q.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(x => {
        x.classList.remove('open');
        x.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        q.classList.add('open');
        q.nextElementSibling.classList.add('open');
      }
    });
  });
</script>

</body>
</html>`;
}

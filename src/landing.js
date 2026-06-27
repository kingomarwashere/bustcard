export function landingPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>1800 Radical — If you get arrested, who finds out?</title>
  <meta name="description" content="If you get arrested, who finds out? One call. No internet. No memory required. Your people get texted in seconds." />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --red: #e53e3e;
      --red-dark: #c53030;
      --black: #0a0a0a;
      --grey: #1a1a1a;
      --grey-mid: #2d2d2d;
      --grey-light: #4a4a4a;
      --white: #f5f5f5;
      --text-muted: #9a9a9a;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
      background: rgba(10,10,10,0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--grey);
    }
    .nav-logo {
      font-size: 1.1rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: var(--white);
      text-decoration: none;
    }
    .nav-logo span { color: var(--red); }
    .nav-cta {
      background: var(--red);
      color: var(--white);
      border: none;
      padding: 8px 20px;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 0.02em;
    }
    .nav-cta:hover { background: var(--red-dark); }

    /* HERO */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 120px 32px 80px;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--red);
      margin-bottom: 24px;
    }
    .hero-eyebrow::before {
      content: '';
      display: block;
      width: 32px;
      height: 2px;
      background: var(--red);
    }
    h1 {
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: -0.04em;
      margin-bottom: 32px;
    }
    h1 em {
      font-style: normal;
      color: var(--red);
    }
    .hero-sub {
      font-size: clamp(1rem, 2.5vw, 1.3rem);
      color: var(--text-muted);
      max-width: 540px;
      margin-bottom: 48px;
      line-height: 1.6;
    }
    .hero-sub strong { color: var(--white); }

    /* NUMBER BADGE */
    .number-badge {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: var(--grey);
      border: 1px solid var(--grey-mid);
      border-radius: 8px;
      padding: 16px 24px;
      margin-bottom: 40px;
    }
    .number-badge .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }
    .number-badge .number {
      font-size: clamp(1.4rem, 4vw, 2.2rem);
      font-weight: 900;
      letter-spacing: 0.05em;
      color: var(--white);
    }
    .number-badge .number span { color: var(--red); }

    /* HERO CTA ROW */
    .hero-ctas {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: center;
    }
    .btn-primary {
      background: var(--red);
      color: var(--white);
      border: none;
      padding: 16px 32px;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      letter-spacing: 0.02em;
      transition: background 0.15s;
    }
    .btn-primary:hover { background: var(--red-dark); }
    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--grey-mid);
      padding: 16px 32px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: border-color 0.15s, color 0.15s;
    }
    .btn-ghost:hover { border-color: var(--white); color: var(--white); }

    /* DIVIDER */
    .section-divider {
      border: none;
      border-top: 1px solid var(--grey);
      margin: 0;
    }

    /* HOW IT WORKS */
    section {
      padding: 96px 32px;
      max-width: 900px;
      margin: 0 auto;
    }
    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--red);
      margin-bottom: 16px;
    }
    h2 {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 64px;
      line-height: 1.1;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 32px;
    }
    .step {
      border-top: 2px solid var(--grey-mid);
      padding-top: 24px;
    }
    .step-num {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--red);
      letter-spacing: 0.1em;
      margin-bottom: 12px;
    }
    .step h3 {
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .step p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.6;
    }

    /* FOR WHO */
    .for-who-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 48px;
    }
    .for-who-card {
      background: var(--grey);
      border: 1px solid var(--grey-mid);
      border-radius: 8px;
      padding: 24px;
    }
    .for-who-card .icon {
      font-size: 1.5rem;
      margin-bottom: 12px;
    }
    .for-who-card h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .for-who-card p {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* BUST CARD HISTORY CALLOUT */
    .callout {
      background: var(--grey);
      border-left: 4px solid var(--red);
      border-radius: 0 8px 8px 0;
      padding: 32px;
      margin: 48px 0;
    }
    .callout p {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-muted);
    }
    .callout p strong { color: var(--white); }

    /* WHY IT WORKS */
    .why-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }
    .why-item { padding: 0; }
    .why-item .check {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .why-item .check svg { flex-shrink: 0; }
    .why-item .check span {
      font-size: 0.95rem;
      font-weight: 700;
    }
    .why-item p {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
      padding-left: 28px;
    }

    /* PRICING */
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
    }
    .pricing-card {
      border: 1px solid var(--grey-mid);
      border-radius: 12px;
      padding: 32px;
      display: flex;
      flex-direction: column;
    }
    .pricing-card.featured {
      border-color: var(--red);
      background: rgba(229,62,62,0.05);
    }
    .pricing-card .tag {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--red);
      margin-bottom: 12px;
    }
    .pricing-card h3 {
      font-size: 1.3rem;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .price {
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      margin-bottom: 4px;
    }
    .price sub {
      font-size: 1rem;
      font-weight: 400;
      color: var(--text-muted);
      vertical-align: baseline;
    }
    .price-note {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    .pricing-features {
      list-style: none;
      flex: 1;
      margin-bottom: 32px;
    }
    .pricing-features li {
      font-size: 0.875rem;
      color: var(--text-muted);
      padding: 8px 0;
      border-bottom: 1px solid var(--grey-mid);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pricing-features li::before {
      content: '—';
      color: var(--red);
      font-weight: 700;
    }
    .pricing-features li.active { color: var(--white); }

    /* SMS PREVIEW */
    .sms-preview {
      background: var(--grey);
      border: 1px solid var(--grey-mid);
      border-radius: 12px;
      padding: 32px;
      margin-top: 48px;
    }
    .sms-preview .sms-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .sms-bubble {
      background: #2a5298;
      color: white;
      border-radius: 18px 18px 4px 18px;
      padding: 14px 18px;
      font-size: 0.875rem;
      line-height: 1.5;
      max-width: 380px;
      margin-bottom: 8px;
    }
    .sms-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* WAITLIST FORM */
    .form-section {
      background: var(--grey);
      border-radius: 16px;
      padding: 48px;
      max-width: 560px;
      margin: 0 auto;
      text-align: center;
    }
    .form-section h2 {
      margin-bottom: 12px;
      font-size: 2rem;
    }
    .form-section p {
      color: var(--text-muted);
      margin-bottom: 32px;
      font-size: 0.9rem;
    }
    .form-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .form-row input {
      flex: 1;
      min-width: 200px;
      background: var(--black);
      border: 1px solid var(--grey-mid);
      color: var(--white);
      padding: 14px 16px;
      border-radius: 6px;
      font-size: 1rem;
      outline: none;
    }
    .form-row input:focus { border-color: var(--red); }
    .form-row input::placeholder { color: var(--grey-light); }
    #waitlist-msg {
      margin-top: 16px;
      font-size: 0.875rem;
      min-height: 20px;
    }
    #waitlist-msg.ok { color: #68d391; }
    #waitlist-msg.err { color: var(--red); }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; gap: 0; }
    .faq-item {
      border-bottom: 1px solid var(--grey-mid);
      padding: 24px 0;
    }
    .faq-q {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .faq-q::after {
      content: '+';
      color: var(--red);
      font-size: 1.4rem;
      font-weight: 300;
      line-height: 1;
      flex-shrink: 0;
    }
    .faq-q.open::after { content: '−'; }
    .faq-a {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.7;
      display: none;
      padding-top: 8px;
    }
    .faq-a.open { display: block; }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--grey);
      padding: 48px 32px;
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .footer-logo {
      font-size: 1.1rem;
      font-weight: 900;
      color: var(--white);
    }
    .footer-logo span { color: var(--red); }
    .footer-links {
      display: flex;
      gap: 24px;
      list-style: none;
    }
    .footer-links a {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-decoration: none;
    }
    .footer-links a:hover { color: var(--white); }
    .footer-disclaimer {
      width: 100%;
      font-size: 0.75rem;
      color: var(--grey-light);
      padding-top: 24px;
      border-top: 1px solid var(--grey);
      margin-top: 8px;
    }

    @media (max-width: 600px) {
      nav { padding: 14px 20px; }
      .hero { padding: 100px 20px 60px; }
      section { padding: 64px 20px; }
      .form-section { padding: 32px 20px; }
      footer { padding: 40px 20px; }
      .form-row { flex-direction: column; }
      .form-row input { min-width: 0; }
    }
  </style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="/" class="nav-logo"><span>1800</span> Radical</a>
  <a href="#signup" class="nav-cta">Get My Radical Number</a>
</nav>

<!-- HERO -->
<div class="hero">
  <div class="hero-eyebrow">Know your rights. Use them.</div>
  <h1>If you get<br>arrested,<br>who finds <em>out?</em></h1>
  <p class="hero-sub">
    <strong>One call. No internet. No memory required.</strong>
    1800 Radical texts your people the moment you dial in — before any interview, from any phone.
  </p>
  <div class="number-badge">
    <div>
      <div class="label">Call this number</div>
      <div class="number"><span>1800</span> RADICAL</div>
    </div>
  </div>
  <div class="hero-ctas">
    <a href="#signup" class="btn-primary">Get your 1800 Radical number</a>
    <a href="#how" class="btn-ghost">How it works</a>
  </div>
</div>

<hr class="section-divider" />

<!-- HOW IT WORKS -->
<section id="how">
  <div class="section-label">How it works</div>
  <h2>Three steps.<br>Two minutes.</h2>
  <div class="steps">
    <div class="step">
      <div class="step-num">01</div>
      <h3>Sign up &amp; add contacts</h3>
      <p>Add up to 10 people — family, friends, your lawyer. You get a member number and a PIN. Write them down somewhere physical.</p>
    </div>
    <div class="step">
      <div class="step-num">02</div>
      <h3>Call 1800 RADICAL</h3>
      <p>If you're arrested, ask to make your phone call. Dial 1800 RADICAL from the station phone — it's free and police must let you make the call.</p>
    </div>
    <div class="step">
      <div class="step-num">03</div>
      <h3>Enter your PIN</h3>
      <p>Key in your 6-digit member number, then your PIN. Everyone on your list gets an SMS within seconds. You don't need to say a word.</p>
    </div>
  </div>

  <div class="sms-preview">
    <div class="sms-label">What your contacts receive</div>
    <div class="sms-bubble">
      URGENT: Jordan Smith has been detained and asked you to be notified. Time: 11:42 PM AEST. They cannot be reached right now. For legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767.
    </div>
    <div class="sms-meta">Delivered instantly to all contacts on your list</div>
  </div>
</section>

<hr class="section-divider" />

<!-- WHO IT'S FOR -->
<section id="who">
  <div class="section-label">Who it's for</div>
  <h2>If you already know the drill, this is for you.</h2>

  <div class="callout">
    <p>
      Activists have been writing a lawyer's number on their forearm in sharpie before a direct action for decades. That piece of paper they hand out at rallies — with the legal support line, the bail fund number — that's the original bust card. <strong>1800 Radical</strong> is the digital version, built so it works even when your phone is gone and your memory is shot.
    </p>
  </div>

  <div class="for-who-grid">
    <div class="for-who-card">
      <div class="icon">✊</div>
      <h3>Activists &amp; protesters</h3>
      <p>Going to a rally, blockade, or direct action? Set this up before you leave the house. Your legal support contacts get notified automatically.</p>
    </div>
    <div class="for-who-card">
      <div class="icon">📋</div>
      <h3>People with a record</h3>
      <p>If you've had contact with police before, you know your phone won't be in your hand when you need it. Plan ahead.</p>
    </div>
    <div class="for-who-card">
      <div class="icon">⚖️</div>
      <h3>Criminal lawyers</h3>
      <p>Give your clients a 1800 Radical as part of onboarding. Your after-hours line gets the first notification, automatically.</p>
    </div>
    <div class="for-who-card">
      <div class="icon">🏠</div>
      <h3>Anyone sensible</h3>
      <p>You don't have to expect it to prepare for it. Takes two minutes to set up, costs nothing to have waiting.</p>
    </div>
  </div>
</section>

<hr class="section-divider" />

<!-- WHY IT WORKS -->
<section>
  <div class="section-label">Why it works</div>
  <h2>Built around how custody actually works in NSW.</h2>
  <div class="why-grid">
    <div class="why-item">
      <div class="check">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#e53e3e"/><path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>1800 = free to call</span>
      </div>
      <p>Even from a police station phone with no money, an 1800 number costs nothing to dial.</p>
    </div>
    <div class="why-item">
      <div class="check">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#e53e3e"/><path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>No smartphone needed</span>
      </div>
      <p>Works from any landline. Police can't unlock your phone anyway — 1800 Radical doesn't need it.</p>
    </div>
    <div class="why-item">
      <div class="check">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#e53e3e"/><path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Works before interview</span>
      </div>
      <p>You have the right to a call before police questioning. That's exactly when 1800 Radical fires.</p>
    </div>
    <div class="why-item">
      <div class="check">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#e53e3e"/><path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Nothing to memorise</span>
      </div>
      <p>One number. One PIN. Write it on your wrist if you have to. That's it.</p>
    </div>
    <div class="why-item">
      <div class="check">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#e53e3e"/><path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Legal resources included</span>
      </div>
      <p>Every alert includes LawAccess NSW and Aboriginal Legal Service numbers. Your contacts know who to call.</p>
    </div>
    <div class="why-item">
      <div class="check">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#e53e3e"/><path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Private by design</span>
      </div>
      <p>We don't record calls. We don't store conversations. Your data is for notification only.</p>
    </div>
  </div>
</section>

<hr class="section-divider" />

<!-- PRICING -->
<section id="pricing">
  <div class="section-label">Plans</div>
  <h2>Simple pricing.<br>No gotchas.</h2>
  <div class="pricing-grid">
    <div class="pricing-card">
      <div class="tag">Free forever</div>
      <h3>Basic</h3>
      <div class="price">$0</div>
      <div class="price-note">No card required</div>
      <ul class="pricing-features">
        <li class="active">1 member number + PIN</li>
        <li class="active">Up to 3 contacts notified</li>
        <li class="active">SMS alert with legal numbers</li>
        <li>Lawyer dial-out</li>
        <li>Protest-day group mode</li>
      </ul>
      <a href="#signup" class="btn-ghost" style="text-align:center;">Get started free</a>
    </div>
    <div class="pricing-card featured">
      <div class="tag">Most popular</div>
      <h3>Full Plan</h3>
      <div class="price">$4.99<sub>/mo</sub></div>
      <div class="price-note">Or $39/year — save $21</div>
      <ul class="pricing-features">
        <li class="active">1 member number + PIN</li>
        <li class="active">Up to 10 contacts notified</li>
        <li class="active">SMS alert with legal numbers</li>
        <li class="active">Lawyer dial-out (auto-calls your lawyer's number)</li>
        <li class="active">Protest-day group mode</li>
      </ul>
      <a href="#signup" class="btn-primary" style="text-align:center;">Get your 1800 Radical</a>
    </div>
  </div>
</section>

<hr class="section-divider" />

<!-- FAQ -->
<section id="faq">
  <div class="section-label">Questions</div>
  <h2>Common questions.</h2>
  <div class="faq-list">
    <div class="faq-item">
      <div class="faq-q">Can police refuse to let me call 1800 RADICAL?</div>
      <div class="faq-a">Under NSW law, you have the right to contact a person to notify them of your arrest. In practice, custody managers have wide discretion about which numbers they'll dial. An 1800 automated service is a grey area — some officers will dial it, some may insist you call a person directly. If you encounter resistance, ask to speak to a Legal Aid or LawAccess duty lawyer first, and let them contact your people. For planned actions, carry the 1800 Radical number <em>and</em> a backup human number.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What exactly does the SMS say?</div>
      <div class="faq-a">Your contacts receive: "[Your name] has been detained and asked you to be notified. Time: [timestamp] AEST. They cannot be reached right now. For legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767." That's it — factual, clear, no drama.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Does this work if I'm sent to prison or remand?</div>
      <div class="faq-a">1800 Radical is designed for the police station stage — the critical first few hours after arrest. Correctional centres run a separate Offender Telephone System (OTS) that only allows pre-approved numbers and blocks third-party services. 1800 Radical doesn't work inside prison — but that's not when you need it. The notification happens at the station, before anything else.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Do my contacts need to sign up for anything?</div>
      <div class="faq-a">No. They just receive an SMS. They don't need an account, an app, or anything. Make sure you've told them in advance that they might receive a message like this, so they know to take it seriously.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">What if I forget my PIN?</div>
      <div class="faq-a">You can reset your PIN by logging into your account online with your email. This is why writing down your member number and PIN physically — not just in your phone — matters. Keep a copy at home and with someone you trust.</div>
    </div>
    <div class="faq-item">
      <div class="faq-q">Is this legal?</div>
      <div class="faq-a">Yes. 1800 Radical is a notification relay service. It sends an SMS on your behalf, nothing more. We don't provide legal advice and we're not a legal service. The SMS includes publicly available legal resource numbers — we're just making sure your people have them.</div>
    </div>
  </div>
</section>

<hr class="section-divider" />

<!-- SIGNUP -->
<section id="signup">
  <div class="form-section">
    <h2>Get your 1800 Radical</h2>
    <p>We're launching soon. Drop your email and we'll let you know when you can set up your contacts and member number.</p>
    <form id="waitlist-form">
      <div class="form-row">
        <input type="text" id="wl-name" placeholder="Your name" autocomplete="given-name" />
        <input type="email" id="wl-email" placeholder="Your email" autocomplete="email" required />
        <button type="submit" class="btn-primary" style="flex-shrink:0;padding:14px 24px;">Join waitlist</button>
      </div>
      <div id="waitlist-msg"></div>
    </form>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo"><span>1800</span> Radical</div>
  <ul class="footer-links">
    <li><a href="#how">How it works</a></li>
    <li><a href="#who">Who it's for</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
  <div class="footer-disclaimer">
    1800 Radical is a notification service, not a legal service. Information on this site is general in nature and does not constitute legal advice. For legal help: LawAccess NSW 1300 888 529 · Aboriginal Legal Service 1800 765 767. &copy; ${new Date().getFullYear()} 1800 Radical.
  </div>
</footer>

<script>
  // FAQ accordion
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

  // Waitlist form
  document.getElementById('waitlist-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const msg = document.getElementById('waitlist-msg');
    const email = document.getElementById('wl-email').value;
    const name = document.getElementById('wl-name').value;
    btn.textContent = '...';
    btn.disabled = true;
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (res.ok) {
        msg.textContent = data.message;
        msg.className = 'ok';
        e.target.reset();
      } else {
        msg.textContent = data.error || 'Something went wrong.';
        msg.className = 'err';
      }
    } catch {
      msg.textContent = 'Network error. Try again.';
      msg.className = 'err';
    } finally {
      btn.textContent = 'Join waitlist';
      btn.disabled = false;
    }
  });
</script>

</body>
</html>`;
}

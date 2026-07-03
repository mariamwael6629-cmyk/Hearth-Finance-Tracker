// ============================================================
// LANDING PAGE
// ============================================================
function goAuth(mode) { STORE.authMode = mode; STORE.authError = ''; navigate('auth'); }

function renderLanding(app) {
  app.className = 'landing';
  app.innerHTML = `
  <nav class="landing-nav" id="lnav">
    <div class="brand"><div class="brand-mark">H</div>Hearth</div>
    <div class="landing-links">
      <a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#security">Security</a><a href="#blog">Blog</a>
    </div>
    <div class="landing-cta">
      <button class="btn btn-ghost btn-sm" onclick="goAuth('login')">Sign in</button>
      <button class="btn btn-primary btn-sm" onclick="goAuth('register')">Start free</button>
      <button class="btn-icon" onclick="STORE.theme=STORE.theme==='dark'?'light':'dark'; applyTheme(STORE.theme); render();" title="Toggle theme" style="border-radius:50%">
        ${STORE.theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero grain">
    <div style="position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(204,131,80,0.18),transparent 70%);top:-100px;right:100px;z-index:0;pointer-events:none"></div>
    <div style="position:absolute;width:300px;height:300px;background:radial-gradient(circle,rgba(181,86,46,0.14),transparent 70%);bottom:0;left:0;z-index:0;pointer-events:none"></div>
    <div style="position:relative;z-index:1" class="fade-up">
      <div class="hero-eyebrow"><span class="eyebrow">Intelligent Finance</span><span class="tag" style="font-size:11px">✦ AI-Powered</span></div>
      <h1 class="h-display">Your money,<br><em>quietly guided</em></h1>
      <p class="lead">Hearth brings calm clarity to your financial life — tracking, predicting, and optimizing with an AI that actually understands how you live.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" onclick="goAuth('register')">Start for free →</button>
        <button class="btn btn-ghost" onclick="goAuth('login')">View demo</button>
      </div>
      <div class="hero-proof">
        <div><span class="num" style="color:var(--copper-bright)">50K+</span><span>people trust Hearth</span></div>
        <div><span class="num" style="color:var(--copper-bright)">$2.4B</span><span>tracked monthly</span></div>
        <div><span class="num" style="color:var(--copper-bright)">4.9★</span><span>average rating</span></div>
      </div>
    </div>
    <div class="hero-mock fade-up" style="animation-delay:.15s">
      <div class="mock-card grain">
        <div class="eyebrow" style="margin-bottom:14px">Net Worth</div>
        <div style="font-family:var(--font-display);font-size:34px;font-weight:600;margin-bottom:4px">$92,890<span style="font-size:.48em;color:var(--copper-bright);margin-left:6px">↑12.4%</span></div>
        <div style="font-size:13px;color:var(--ink-muted);margin-bottom:22px">vs last quarter</div>
        <div style="display:flex;gap:16px;margin-bottom:18px">
          ${[['Income', '$7,340', 'pos'], ['Expenses', '$3,290', 'neg'], ['Saved', '$4,050', 'pos']].map(([l, v, t]) => `
          <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 12px">
            <div style="font-size:11.5px;color:var(--ink-muted);margin-bottom:6px">${l}</div>
            <div style="font-family:var(--font-mono);font-weight:700;font-size:14px;color:${t === 'pos' ? 'var(--amber)' : 'var(--coral)'}">${v}</div>
          </div>`).join('')}
        </div>
        <div style="height:6px;background:var(--border);border-radius:10px;overflow:hidden">
          <div style="width:64%;height:100%;background:linear-gradient(90deg,var(--copper-bright),var(--terracotta));border-radius:10px"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--ink-muted);margin-top:6px"><span>64% savings rate</span><span>Goal: 70%</span></div>
      </div>
      <div class="mock-float f1" style="min-width:190px">
        <div class="eyebrow" style="margin-bottom:8px;font-size:10px">AI Insight ✦</div>
        <div style="font-size:13.5px;font-weight:700;margin-bottom:4px">Save $340 this month</div>
        <div style="font-size:12px;color:var(--ink-muted)">Dining spend is 28% above average</div>
      </div>
      <div class="mock-float f2" style="min-width:170px">
        <div style="font-size:12px;color:var(--ink-muted);margin-bottom:6px">Health Score</div>
        <div style="font-family:var(--font-display);font-size:28px;font-weight:600;color:var(--copper-bright)">82 <span style="font-size:.5em;color:var(--ink-muted)">/ 100</span></div>
        <div style="font-size:12px;color:var(--amber)">↑ 6 pts this month</div>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="section" id="features">
    <div class="section-head">
      <span class="eyebrow">Everything you need</span>
      <h2 class="h-display">Finance tools that feel <em class="h-serif-italic">human</em></h2>
      <p>Built for people who want clarity without complexity — every feature designed to reduce stress, not add it.</p>
    </div>
    <div class="feature-grid stagger">
      ${[
        ['🧠', 'AI Insights', 'Spending pattern detection, monthly expense prediction, and smart budget suggestions — all personalized to you.'],
        ['📊', 'Visual Analytics', 'Beautiful cash flow charts, category breakdowns, and trend analysis that tell your financial story.'],
        ['🎯', 'Savings Goals', 'Set targets, track progress with progress rings, and get monthly savings recommendations.'],
        ['📅', 'Bill Reminders', 'Never miss a payment. Smart calendar view with upcoming bills and recurring expense tracking.'],
        ['💳', 'Multi-Account', 'Connect checking, savings, investments, and credit cards for a complete picture.'],
        ['🛡️', 'Security First', 'Bank-level encryption, hashed passwords, and zero data selling. Your data stays yours.'],
      ].map(([i, t, d]) => `
      <div class="card card-hover feature-card grain">
        <div class="feature-icon">${i}</div>
        <h3>${t}</h3>
        <p>${d}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- AI SPOTLIGHT -->
  <section class="section">
    <div class="ai-spotlight">
      <div>
        <span class="eyebrow" style="display:block;margin-bottom:16px">Powered by AI</span>
        <h2 class="h-display" style="font-size:clamp(26px,3vw,36px);margin-bottom:14px">Your personal<br><em class="h-serif-italic">financial advisor</em></h2>
        <p style="color:var(--ink-muted);line-height:1.6;margin-bottom:24px">Hearth's AI analyzes your patterns to deliver insights that go beyond dashboards — it understands context, detects anomalies, and guides smarter decisions.</p>
        <button class="btn btn-primary btn-sm" onclick="goAuth('register')">Try it free →</button>
      </div>
      <div>
        <div class="ai-pill-list">
          ${[
            ['Spending Anomaly Detected', 'Your dining spend this week is 2.4× your usual — Hearth flagged it before you noticed.'],
            ['Monthly Forecast', "Based on your patterns, you'll spend ~$3,420 this month. Budget is $3,800. You're on track."],
            ['Savings Opportunity', 'Switching to annual subscriptions could save you $184/year. One-tap to review.'],
            ['Financial Health Score', 'Your score jumped 8 points — lower credit utilization and consistent savings.'],
          ].map(([t, d]) => `
          <div class="ai-pill">
            <span class="dot"></span>
            <div><strong>${t}</strong><span>${d}</span></div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIAL -->
  <section class="section">
    <div class="quote-block fade-up">
      <p>"Hearth is the only finance app I've actually used past January. The AI caught a subscription I'd forgotten about and the insights feel like they're written for me, not just generated."</p>
      <div class="who">— Zara M., Freelance Designer · Saved $3,200 in 4 months</div>
    </div>
  </section>

  <!-- CTA -->
  <div class="cta-band grain">
    <span class="eyebrow" style="display:block;margin-bottom:16px;opacity:.75">Start today, free</span>
    <h2 class="h-display">Ready to see where<br><em class="h-serif-italic">your money really goes?</em></h2>
    <p>Join 50,000+ people who chose calm over chaos.</p>
    <button class="btn btn-primary" onclick="goAuth('register')">Create your free account →</button>
  </div>

  <!-- FOOTER -->
  <footer class="landing-footer">
    <div class="brand"><div class="brand-mark">H</div>Hearth</div>
    <div class="footer-cols">
      ${[['Product', ['Features', 'Pricing', 'Security', 'API']], ['Company', ['About', 'Blog', 'Careers', 'Press']], ['Legal', ['Privacy', 'Terms', 'Cookies', 'GDPR']]].map(([h, links]) => `
      <div class="footer-col"><h4>${h}</h4>${links.map((l) => `<a href="#">${l}</a>`).join('')}</div>`).join('')}
    </div>
    <div style="font-size:13px;color:var(--ink-faint)">© 2025 Hearth · All rights reserved</div>
  </footer>
  `;
  window.onscroll = () => {
    const n = $('lnav');
    if (n) n.classList.toggle('scrolled', window.scrollY > 40);
  };
}

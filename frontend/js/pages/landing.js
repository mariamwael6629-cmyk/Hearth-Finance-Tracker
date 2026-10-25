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
      <button class="btn-icon" onclick="STORE.theme=STORE.theme==='dark'?'light':'dark'; applyTheme(STORE.theme); render();" title="Toggle theme" aria-label="Toggle theme">
        ${STORE.theme === 'dark' ? icon('sun') : icon('moon')}
      </button>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-copy fade-up">
      <div class="hero-eyebrow"><span class="eyebrow">Personal finance</span><span class="tag">${icon('spark', 13)} AI insights</span></div>
      <h1 class="h-display">Your money, <em>quietly guided</em></h1>
      <p class="lead">Hearth keeps your accounts, bills and goals in one place, and its AI points out the patterns in how you actually spend.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" onclick="goAuth('register')">Start for free ${icon('arrow', 16)}</button>
        <button class="btn btn-ghost" onclick="goAuth('login')">View demo</button>
      </div>
      <div class="hero-proof">
        <div><span class="num">50K+</span><span>people trust Hearth</span></div>
        <div><span class="num">$2.4B</span><span>tracked monthly</span></div>
        <div><span class="num">4.9</span><span>average rating</span></div>
      </div>
    </div>

    <div class="hero-mock fade-up" style="animation-delay:.12s" data-ui>
      <div class="statement">
        <div class="st-head">
          <div class="brand"><div class="brand-mark">H</div>Hearth</div>
          <span>Quarterly statement</span>
        </div>
        <div class="st-label">Net worth</div>
        <div class="st-total">$92,890 <span class="st-change">${icon('up', 14)} 12.4%</span></div>
        <div class="st-sub">vs last quarter</div>
        <div class="st-lines">
          <div class="st-line"><span>Income</span><i></i><b class="pos">$7,340</b></div>
          <div class="st-line"><span>Expenses</span><i></i><b class="neg">−$3,290</b></div>
          <div class="st-line total"><span>Saved</span><i></i><b class="pos">$4,050</b></div>
        </div>
        <div class="st-bar"><div style="width:64%"></div><span class="st-goal" style="left:70%"></span></div>
        <div class="st-bar-legend"><span>64% savings rate</span><span>Goal: 70%</span></div>
      </div>
      <div class="stamp stamp-insight">
        <div class="stamp-k">AI insight</div>
        <strong>Save $340 this month</strong>
        <span>Dining spend is 28% above average</span>
      </div>
      <div class="stamp stamp-score">
        <div class="stamp-k">Health score</div>
        <strong>82<small>/100</small></strong>
        <span class="pos">${icon('up', 12)} 6 pts this month</span>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="section" id="features">
    <div class="section-head">
      <span class="eyebrow">What's included</span>
      <h2 class="h-display">Finance tools that feel <em class="h-serif-italic">human</em></h2>
      <p>Each one does a single job: show you where the money went, and what's coming next.</p>
    </div>
    <div class="feature-grid stagger">
      ${[
        ['brain', 'AI Insights', 'Spots spending patterns, predicts next month\'s expenses and suggests budgets, based on your own history.'],
        ['chart', 'Visual Analytics', 'Cash flow, category breakdowns and trends, charted from your real transactions.'],
        ['target', 'Savings Goals', 'Set a target and follow it with progress rings and a suggested monthly amount.'],
        ['calendar', 'Bill Reminders', 'A calendar of upcoming bills and recurring expenses, so a payment never slips past you.'],
        ['card', 'Multi-Account', 'Checking, savings, investments and credit cards, all in one view.'],
        ['shield', 'Security First', 'Bank-level encryption and hashed passwords, and we never sell your data.'],
      ].map(([i, t, d]) => `
      <div class="feature-card">
        <div class="feature-icon">${icon(i, 22)}</div>
        <h3>${t}</h3>
        <p>${d}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- AI SPOTLIGHT -->
  <section class="section">
    <div class="ai-spotlight">
      <div>
        <span class="eyebrow">Powered by AI</span>
        <h2 class="h-display">Your personal <em class="h-serif-italic">financial advisor</em></h2>
        <p>Hearth's AI reads your transactions in context. It flags unusual spending, forecasts the month, and suggests what to change.</p>
        <button class="btn btn-primary btn-sm" onclick="goAuth('register')">Try it free ${icon('arrow', 15)}</button>
      </div>
      <div>
        <div class="ai-pill-list">
          ${[
            ['Spending Anomaly Detected', 'Your dining spend this week is 2.4× your usual. Hearth flagged it before you noticed.'],
            ['Monthly Forecast', "Based on your patterns, you'll spend about $3,420 this month against a $3,800 budget. You're on track."],
            ['Savings Opportunity', 'Switching to annual subscriptions could save you $184 a year. One tap to review.'],
            ['Financial Health Score', 'Your score went up 8 points, thanks to lower credit utilization and steady saving.'],
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
      <div class="who">Zara M., Freelance Designer · Saved $3,200 in 4 months</div>
    </div>
  </section>

  <!-- CTA -->
  <div class="cta-band">
    <span class="eyebrow">Free to start</span>
    <h2 class="h-display">Ready to see where <em class="h-serif-italic">your money really goes?</em></h2>
    <p>Join 50,000+ people who already keep track with Hearth.</p>
    <button class="btn btn-primary" onclick="goAuth('register')">Create your free account ${icon('arrow', 16)}</button>
  </div>

  <!-- FOOTER -->
  <footer class="landing-footer">
    <div class="brand"><div class="brand-mark">H</div>Hearth</div>
    <div class="footer-cols">
      ${[['Product', ['Features', 'Pricing', 'Security', 'API']], ['Company', ['About', 'Blog', 'Careers', 'Press']], ['Legal', ['Privacy', 'Terms', 'Cookies', 'GDPR']]].map(([h, links]) => `
      <div class="footer-col"><h4>${h}</h4>${links.map((l) => `<a href="#">${l}</a>`).join('')}</div>`).join('')}
    </div>
    <div class="footer-copy">© 2025 Hearth · All rights reserved</div>
  </footer>
  `;
  window.onscroll = () => {
    const n = $('lnav');
    if (n) n.classList.toggle('scrolled', window.scrollY > 40);
  };
}

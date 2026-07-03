// ============================================================
// AUTH PAGE — login / register / forgot password
// ============================================================
function renderAuth(app) {
  app.className = '';
  const mode = STORE.authMode;
  app.innerHTML = `
  <div class="auth-wrap">
    <div class="auth-side grain">
      <div class="brand"><div class="brand-mark">H</div>Hearth</div>
      <div style="position:relative;z-index:1">
        <div class="quote-block" style="text-align:left;margin:0;max-width:400px">
          <div class="eyebrow" style="display:block;margin-bottom:20px">Smart Finance</div>
          <p style="font-family:var(--font-display);font-style:italic;font-size:clamp(22px,2.4vw,28px);line-height:1.5">"The dashboard that finally made me feel in control of money — not scared of it."</p>
          <div class="who" style="margin-top:20px">— Sara L., Product Manager</div>
        </div>
      </div>
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <div class="tag">✓ Hashed passwords</div>
        <div class="tag">✓ No ads, ever</div>
        <div class="tag">✓ Free to start</div>
      </div>
      <div style="position:absolute;width:350px;height:350px;background:radial-gradient(circle,rgba(204,131,80,0.15),transparent 70%);bottom:-80px;right:-60px;pointer-events:none"></div>
    </div>
    <div class="auth-form-side">
      <div class="auth-card fade-up">
        <div class="auth-tabs">
          <button class="auth-tab ${mode === 'login' ? 'active' : ''}" onclick="STORE.authMode='login';STORE.authError='';render()">Sign in</button>
          <button class="auth-tab ${mode === 'register' ? 'active' : ''}" onclick="STORE.authMode='register';STORE.authError='';render()">Create account</button>
        </div>
        ${STORE.authError ? `<div class="auth-error">${escapeHtml(STORE.authError)}</div>` : ''}
        ${mode === 'forgot' ? renderForgot() : mode === 'login' ? renderLogin() : renderRegister()}
        <div class="auth-foot">
          ${mode === 'login' ? `Don't have an account? <button onclick="STORE.authMode='register';STORE.authError='';render()">Sign up free</button>` :
            mode === 'register' ? `Already have an account? <button onclick="STORE.authMode='login';STORE.authError='';render()">Sign in</button>` : ''}
        </div>
      </div>
    </div>
  </div>`;
}

function renderLogin() {
  return `<form class="auth-form" onsubmit="handleLogin(this);return false;">
    <div class="input-wrap"><label>Email address</label><input class="input" name="email" type="email" placeholder="you@example.com" required></div>
    <div class="input-wrap"><label>Password</label><input class="input" name="password" type="password" placeholder="••••••••" required></div>
    <div class="checkbox-row">
      <label><span class="chk">✓</span> Remember me</label>
      <button type="button" style="color:var(--copper-bright);font-weight:600;font-size:13.5px" onclick="STORE.authMode='forgot';render()">Forgot password?</button>
    </div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Sign in →</button>
    <button class="btn btn-ghost" type="button" style="width:100%;justify-content:center" onclick="fillDemoLogin(this.form)">✦ Use demo account</button>
  </form>`;
}

function fillDemoLogin(form) {
  form = form || document.querySelector('.auth-form');
  if (!form) return;
  form.email.value = 'demo@hearth.app';
  form.password.value = 'password123';
}

function renderRegister() {
  return `<form class="auth-form" onsubmit="handleRegister(this);return false;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="input-wrap"><label>First name</label><input class="input" name="first_name" type="text" placeholder="Mariam" required></div>
      <div class="input-wrap"><label>Last name</label><input class="input" name="last_name" type="text" placeholder="Khalil" required></div>
    </div>
    <div class="input-wrap"><label>Email address</label><input class="input" name="email" type="email" placeholder="you@example.com" required></div>
    <div class="input-wrap"><label>Password</label><input class="input" name="password" type="password" placeholder="Min. 8 characters" minlength="8" required></div>
    <div class="input-wrap select-wrap">
      <label>Base currency</label>
      <select class="input" name="currency">
        ${Object.keys(CURRENCIES).map((c) => `<option value="${c}">${c} — ${CURRENCIES[c]}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Create account →</button>
  </form>`;
}

function renderForgot() {
  return `<div class="auth-form">
    <p style="font-size:14.5px;color:var(--ink-muted);margin-bottom:6px">Enter your email and we'll send a reset link.</p>
    <div class="input-wrap"><label>Email address</label><input class="input" type="email" placeholder="you@example.com"></div>
    <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="toast('Reset link sent to your email','success')">Send reset link →</button>
    <button style="width:100%;text-align:center;padding:12px;font-size:14px;color:var(--ink-muted);font-weight:600" onclick="STORE.authMode='login';render()">← Back to sign in</button>
  </div>`;
}

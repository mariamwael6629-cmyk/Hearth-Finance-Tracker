// ============================================================
// RENDER ENGINE — page dispatch + app shell
// ============================================================
let charts = {};
const destroyCharts = () => { Object.values(charts).forEach((c) => { try { c.destroy(); } catch (e) {} }); charts = {}; };

function render() {
  destroyCharts();
  applyTheme(STORE.theme);
  const app = $('app');
  app.innerHTML = '';

  if (STORE.authLoading) { app.className = ''; app.innerHTML = `<div class="boot-loader"><div class="boot-mark">H</div></div>`; return; }
  if (!STORE.currentUser) {
    if (STORE.page === 'auth') { renderAuth(app); return; }
    renderLanding(app);
    return;
  }
  renderShell(app);
}

function renderShell(app) {
  app.className = 'app-shell';
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'transactions', label: 'Transactions', icon: '⇌' },
    { id: 'budget', label: 'Budget Planner', icon: '◎' },
    { id: 'savings', label: 'Savings Goals', icon: '◑' },
    { id: 'analytics', label: 'Analytics', icon: '◆' },
    { id: 'reports', label: 'Reports', icon: '≡' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '↻' },
    { id: 'calendar', label: 'Calendar', icon: '▦' },
    { id: 'settings', label: 'Settings', icon: '⊙' },
    { id: 'profile', label: 'Profile', icon: '◯' },
  ];
  const pageTitle = { dashboard: 'Dashboard', transactions: 'Transactions', budget: 'Budget Planner', savings: 'Savings Goals', analytics: 'Analytics', reports: 'Reports', subscriptions: 'Subscriptions', calendar: 'Financial Calendar', settings: 'Settings', profile: 'Profile' };
  const pageSubtitle = { dashboard: `Good ${getGreeting()}, ${STORE.currentUser.first_name} ✦`, transactions: 'All your transactions', budget: 'Plan and track spending', savings: 'Your goals in motion', analytics: 'Patterns & trends', reports: 'Export & download', subscriptions: 'Active subscriptions', calendar: 'Bills & reminders', settings: 'Preferences', profile: 'Your account' };

  app.innerHTML = `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand"><div class="brand-mark">H</div>Hearth</div>
    <div class="nav-section-label">Main</div>
    ${navItems.slice(0, 6).map((n) => `
    <button class="nav-item ${STORE.page === n.id ? 'active' : ''}" onclick="navigate('${n.id}')">
      <span class="ic">${n.icon}</span>${n.label}
    </button>`).join('')}
    <div class="nav-section-label">Tools</div>
    ${navItems.slice(6, 8).map((n) => `
    <button class="nav-item ${STORE.page === n.id ? 'active' : ''}" onclick="navigate('${n.id}')">
      <span class="ic">${n.icon}</span>${n.label}
    </button>`).join('')}
    <div class="nav-section-label">Account</div>
    ${navItems.slice(8).map((n) => `
    <button class="nav-item ${STORE.page === n.id ? 'active' : ''}" onclick="navigate('${n.id}')">
      <span class="ic">${n.icon}</span>${n.label}
    </button>`).join('')}
    <button class="nav-item" onclick="handleLogout()"><span class="ic">⏻</span>Log out</button>
    <div class="sidebar-foot">
      <div class="user-chip">
        <div class="avatar">${STORE.currentUser.initials}</div>
        <div><div class="name">${escapeHtml(STORE.currentUser.name)}</div><div class="mail">${escapeHtml(STORE.currentUser.email)}</div></div>
      </div>
    </div>
  </aside>
  <div class="main-area">
    <header class="topbar">
      <div style="display:flex;align-items:center;gap:14px">
        <button class="btn-icon mobile-toggle" onclick="toggleSidebar()" title="Menu">☰</button>
        <div class="page-title-row">
          <h1>${pageTitle[STORE.page] || STORE.page}</h1>
          <span>${pageSubtitle[STORE.page] || ''}</span>
        </div>
      </div>
      <div class="topbar-search">
        <span style="color:var(--ink-faint)">⌕</span>
        <input type="text" placeholder="Search anything…">
      </div>
      <div class="topbar-right">
        <button class="btn-icon" onclick="STORE.theme=STORE.theme==='dark'?'light':'dark';applyTheme(STORE.theme);render();" title="Toggle theme">${STORE.theme === 'dark' ? '☀️' : '🌙'}</button>
        <div style="position:relative">
          <button class="btn-icon" onclick="toast('No new notifications','info')" title="Notifications">🔔
            <span class="notif-dot"></span>
          </button>
        </div>
        <div class="avatar" style="cursor:pointer;width:36px;height:36px;font-size:13px" onclick="navigate('profile')">${STORE.currentUser.initials}</div>
      </div>
    </header>
    <div class="content" id="page-content"></div>
  </div>`;

  const content = $('page-content');
  const pages = { dashboard: renderDashboard, transactions: renderTransactions, budget: renderBudget, savings: renderSavings, analytics: renderAnalytics, reports: renderReports, subscriptions: renderSubscriptions, calendar: renderCalendar, settings: renderSettings, profile: renderProfile };
  if (pages[STORE.page]) pages[STORE.page](content);
  else renderDashboard(content);
}

function toggleSidebar() {
  const s = $('sidebar');
  STORE.sidebarOpen = !STORE.sidebarOpen;
  s.classList.toggle('open', STORE.sidebarOpen);
  if (STORE.sidebarOpen) {
    const sc = document.createElement('div'); sc.className = 'sidebar-scrim'; sc.id = 'sb-scrim';
    sc.onclick = toggleSidebar; document.body.appendChild(sc);
  } else { const sc = $('sb-scrim'); if (sc) sc.remove(); }
}

// ============================================================
// INIT
// ============================================================
applyTheme(STORE.theme);
render();
bootstrapSession();

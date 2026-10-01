// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard(c) {
  const income = STORE.summary ? STORE.summary.monthly_income : 0;
  const expense = STORE.summary ? STORE.summary.monthly_expense : 0;
  const netWorth = STORE.summary ? STORE.summary.net_worth : 0;
  const savingsRate = STORE.summary ? Math.round(STORE.summary.savings_rate) : 0;
  const catBreakdown = (STORE.summary && STORE.summary.category_breakdown) || [];
  const catTotal = catBreakdown.reduce((s, x) => s + x.amount, 0) || 1;
  const catColors = ['#E2825F', '#CC8350', '#CE9A52', '#D9A892', '#A8543A', '#B5562E'];

  c.innerHTML = `
  <div class="stagger">
    <!-- AI Insights Strip -->
    <div class="ai-insight-strip">
      ${[
        { ic: '🧠', t: 'Spending Pattern', d: 'Your dining costs spiked above your 3-month average this week. Consider cooking more at home.' },
        { ic: '📈', t: 'Monthly Forecast', d: `Projected spend: ${fmt(expense)}. Keep an eye on your budget to stay on track.` },
        { ic: '💡', t: 'Savings Tip', d: 'Switching subscriptions to annual billing could save you money each year.' },
        { ic: '🏆', t: 'Financial Health', d: `Your savings rate is ${savingsRate}% this month. Consistent savings = great progress.` },
      ].map((i) => `<div class="insight-card grain"><div class="ic">${i.ic}</div><strong>${i.t}</strong><p>${i.d}</p></div>`).join('')}
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      ${[['➕ Add Transaction', 'addTx'], ['🏦 Add Account', 'addAcc'], ['📊 New Budget', 'addBudget'], ['🎯 Add Goal', 'addGoal'], ['📄 Export Report', 'er']].map(([l, a]) => `
      <button class="quick-action" onclick="quickAction('${a}')">${l}</button>`).join('')}
    </div>

    <!-- Stat Cards -->
    <div class="stat-grid">
      ${[
        ['Net Worth', fmt(netWorth), true],
        ['Monthly Income', fmt(income), true],
        ['Monthly Expenses', fmt(expense), false],
        ['Savings Rate', `${savingsRate}%`, savingsRate >= 0],
      ].map(([l, v, pos]) => `
      <div class="card stat-card grain">
        <div class="label">${l}</div>
        <div class="value num">${v}</div>
        <span class="change ${pos ? 'pos' : 'neg'}">${pos ? '↑' : '↓'}</span>
      </div>`).join('')}
    </div>

    <!-- Main Charts Row -->
    <div class="dash-grid">
      <div class="card dash-panel grain">
        <div class="panel-head">
          <h3>Cash Flow</h3>
        </div>
        <div class="chart-wrap"><canvas id="cashflow-chart" height="220"></canvas></div>
      </div>
      <div class="card dash-panel grain">
        <div class="panel-head"><h3>Spending by Category</h3></div>
        <div class="chart-wrap" style="max-width:240px;margin:0 auto 16px"><canvas id="cat-chart" height="220"></canvas></div>
        <div class="cat-list">
          ${catBreakdown.length ? catBreakdown.slice(0, 6).map((x, i) => `
          <div class="cat-row">
            <div class="cat-dot" style="background:${catColors[i % catColors.length]}"></div>
            <span class="cat-label">${escapeHtml(x.category)}</span>
            <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round((x.amount / catTotal) * 100)}%;background:${catColors[i % catColors.length]}"></div></div>
            <span class="cat-amount">${Math.round((x.amount / catTotal) * 100)}%</span>
          </div>`).join('') : `<div class="empty-state"><div class="empty-icon">📊</div><strong>No spending yet</strong><p>Add transactions to see your breakdown.</p></div>`}
        </div>
      </div>
    </div>

    <!-- Second Row -->
    <div class="dash-grid">
      <div class="card dash-panel grain">
        <div class="panel-head"><h3>Recent Transactions</h3><button class="btn btn-ghost btn-sm" onclick="navigate('transactions')">View all →</button></div>
        <div class="activity-list">
          ${STORE.transactions.slice(0, 6).map((t) => `
          <div class="activity-item">
            <div class="tx-icon">${t.icon}</div>
            <div class="tx-info">
              <div class="name">${escapeHtml(t.merchant)}</div>
              <div class="meta">${escapeHtml(t.category)} · ${t.date}</div>
            </div>
            <div class="tx-amount ${t.amount > 0 ? 'inc' : 'exp'}">${t.amount > 0 ? '+' : ''}${fmt(t.amount)}</div>
          </div>`).join('') || `<div class="empty-state"><div class="empty-icon">⇌</div><strong>No transactions yet</strong><p>Add your first transaction to get started.</p></div>`}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="card net-worth-card grain">
          <div class="eyebrow">Accounts</div>
          <div class="big">${fmt(netWorth)}</div>
          <div style="font-size:13px;color:var(--ink-muted)">Total net worth · Updated now</div>
          <div class="account-pills">
            ${STORE.accounts.map((a) => `
            <div class="account-pill"><span class="dot" style="background:${a.color}"></span><span>${escapeHtml(a.name.split(' ')[0])}</span><span class="num" style="color:${a.balance < 0 ? 'var(--coral)' : 'var(--copper-bright)'}">${fmt(a.balance)}</span></div>`).join('') || '<span style="font-size:13px;color:var(--ink-muted)">No accounts yet</span>'}
          </div>
        </div>
        <div class="card dash-panel grain">
          <div class="panel-head"><h3>Financial Health</h3></div>
          <div class="health-score-wrap">
            <div class="ring-wrap" id="health-ring">
              <svg width="100" height="100">
                <circle class="ring-track" cx="50" cy="50" r="40"/>
                <circle class="ring-fill" cx="50" cy="50" r="40" stroke="url(#cg)" stroke-dasharray="${2 * Math.PI * 40}" stroke-dashoffset="${2 * Math.PI * 40 * (1 - Math.min(1, Math.max(0, savingsRate / 100)))}"/>
                <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#E0A06C"/><stop offset="100%" stop-color="#B5562E"/></linearGradient></defs>
              </svg>
              <div class="ring-center"><span class="num" style="font-size:22px;font-weight:700;color:var(--copper-bright)">${savingsRate}</span><span style="font-size:11px;color:var(--ink-muted)">/100</span></div>
            </div>
            <div class="health-label">
              <div class="score-num">${savingsRate >= 70 ? 'Excellent' : savingsRate >= 40 ? 'Good' : savingsRate >= 0 ? 'Fair' : 'Needs work'}</div>
              <div class="score-text">Based on your savings rate</div>
              <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
                ${[['Savings Rate', `${savingsRate}%`], ['Monthly Income', fmt(income)], ['Monthly Expenses', fmt(expense)]].map(([l, v]) => `
                <div style="font-size:12.5px;display:flex;justify-content:space-between;gap:20px"><span style="color:var(--ink-muted)">${l}</span><span class="num" style="font-weight:700;color:var(--copper-bright)">${v}</span></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Overview -->
    <div class="card dash-panel grain">
      <div class="panel-head"><h3>Budget Overview</h3><button class="btn btn-ghost btn-sm" onclick="navigate('budget')">Manage →</button></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px">
        ${STORE.budgets.slice(0, 6).map((b) => {
          const pct = Math.min(100, (b.spent / (b.limit || 1)) * 100);
          const cls = pct >= 90 ? 'crit' : pct >= 70 ? 'warn' : 'ok';
          return `<div class="budget-row">
            <div class="meta"><span class="cat-name">${b.icon} ${escapeHtml(b.category)}</span><span class="amounts">${fmt(b.spent)} / ${fmt(b.limit)}</span></div>
            <div class="budget-track"><div class="budget-fill ${cls}" style="width:${pct}%"></div></div>
          </div>`;
        }).join('') || `<div class="empty-state"><div class="empty-icon">◎</div><strong>No budgets yet</strong><p>Create a budget category to start tracking.</p></div>`}
      </div>
    </div>
  </div>
  `;

  requestAnimationFrame(() => {
    drawCashflowChart();
    drawCategoryChart();
  });
}

function getChartTheme() {
  const s = getComputedStyle(document.documentElement);
  const v = (k) => s.getPropertyValue(k).trim();
  return {
    muted: v('--ink-muted'),
    border: v('--border'),
    copper: v('--copper'),
    amber: v('--amber'),
    coral: v('--coral'),
    dark: document.documentElement.getAttribute('data-theme') === 'dark',
  };
}

function drawCashflowChart() {
  const ctx = $('cashflow-chart');
  if (!ctx) return;
  const cc = getChartTheme();
  const cashflow = (STORE.summary && STORE.summary.cashflow) || [];
  const isDark = cc.dark;
  const gridColor = isDark ? 'rgba(248,244,237,0.05)' : 'rgba(18,14,9,0.05)';
  charts['cashflow'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cashflow.map((x) => x.month),
      datasets: [
        { label: 'Income',   data: cashflow.map((x) => x.income),  backgroundColor: isDark ? 'rgba(208,160,56,0.7)' : 'rgba(192,107,48,0.65)', borderRadius: 6, borderSkipped: false },
        { label: 'Expenses', data: cashflow.map((x) => x.expense), backgroundColor: isDark ? 'rgba(224,112,96,0.55)' : 'rgba(208,72,48,0.45)', borderRadius: 6, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: cc.muted, font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } } } },
      scales: {
        x: { ticks: { color: cc.muted, font: { family: 'DM Mono', size: 10 } }, grid: { color: gridColor } },
        y: { ticks: { color: cc.muted, font: { family: 'DM Mono', size: 10 }, callback: (v) => '$' + v.toLocaleString() }, grid: { color: gridColor } },
      },
    },
  });
}

function drawCategoryChart() {
  const ctx = $('cat-chart');
  if (!ctx) return;
  const catBreakdown = (STORE.summary && STORE.summary.category_breakdown) || [];
  const catColors = ['#E2825F', '#CC8350', '#CE9A52', '#D9A892', '#A8543A', '#B5562E'];
  charts['cat'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: catBreakdown.map((x) => x.category),
      datasets: [{ data: catBreakdown.map((x) => x.amount), backgroundColor: catBreakdown.map((_, i) => catColors[i % catColors.length]), borderWidth: 0, hoverOffset: 8 }],
    },
    options: { cutout: '70%', responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } },
  });
}

function quickAction(a) {
  if (a === 'addTx') return openTransactionModal();
  if (a === 'addAcc') return openAccountModal();
  if (a === 'addBudget') return openBudgetModal();
  if (a === 'addGoal') return openGoalModal();
  if (a === 'er') { navigate('reports'); return; }
  toast('Action triggered', 'info');
}

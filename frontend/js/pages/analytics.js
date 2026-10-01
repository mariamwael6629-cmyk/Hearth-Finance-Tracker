// ============================================================
// ANALYTICS
// ============================================================
function renderAnalytics(c) {
  const sortedBudgets = [...STORE.budgets].sort((a, b) => b.spent - a.spent);
  const maxSpent = sortedBudgets.length ? sortedBudgets[0].spent || 1 : 1;

  c.innerHTML = `
  <div class="stagger">
    <div class="analytics-grid">
      <div class="card analytics-full dash-panel grain">
        <div class="panel-head">
          <h3>Income vs Expenses Trend</h3>
        </div>
        <canvas id="trend-chart" height="200"></canvas>
      </div>
      <div class="card dash-panel grain">
        <div class="panel-head"><h3>Spending Breakdown</h3></div>
        <canvas id="spend-chart" height="260"></canvas>
      </div>
      <div class="card dash-panel grain">
        <div class="panel-head"><h3>Top Spending Categories</h3></div>
        <div style="display:flex;flex-direction:column;gap:0">
          ${sortedBudgets.map((b, i) => `
          <div class="trend-row">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-family:var(--font-mono);font-size:12px;color:var(--ink-faint);width:18px">${String(i + 1).padStart(2, '0')}</span>
              <span style="font-size:15px">${b.icon}</span>
              <span class="month">${escapeHtml(b.category)}</span>
            </div>
            <div class="bars">
              <div class="trend-mini" style="width:${Math.round((b.spent / maxSpent) * 80 + 10)}px;background:${b.color}80"></div>
              <span class="num" style="font-size:13.5px;font-weight:700;color:var(--copper-bright);min-width:70px;text-align:right">${fmt(b.spent)}</span>
            </div>
          </div>`).join('') || `<div class="empty-state"><div class="empty-icon">📊</div><strong>No budgets yet</strong><p>Add budget categories to see trends.</p></div>`}
        </div>
      </div>
      <div class="card dash-panel grain">
        <div class="panel-head"><h3>Monthly Savings</h3></div>
        <canvas id="savings-chart" height="260"></canvas>
      </div>
      <div class="card dash-panel grain analytics-full">
        <div class="panel-head"><h3>Recent Spending by Day</h3></div>
        <canvas id="daily-chart" height="160"></canvas>
      </div>
    </div>
  </div>`;
  requestAnimationFrame(() => {
    drawTrendChart(); drawSpendChart(); drawSavingsChart(); drawDailyChart();
  });
}

function getChartThemeA() {
  const s = getComputedStyle(document.documentElement);
  const v = (k) => s.getPropertyValue(k).trim();
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    muted: v('--ink-muted'), dark,
    grid: dark ? 'rgba(248,244,237,0.05)' : 'rgba(18,14,9,0.05)',
    mono: 'DM Mono',
  };
}

function drawTrendChart() {
  const ctx = $('trend-chart'); if (!ctx) return;
  const cc = getChartThemeA();
  const cashflow = (STORE.summary && STORE.summary.cashflow) || [];
  const incomeColor  = cc.dark ? '#D0A038' : '#C06B30';
  const expenseColor = cc.dark ? '#E07060' : '#D04830';
  charts['trend'] = new Chart(ctx, {
    type: 'line',
    data: { labels: cashflow.map((x) => x.month), datasets: [
      { label: 'Income',   data: cashflow.map((x) => x.income),  borderColor: incomeColor,  backgroundColor: incomeColor  + '14', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: incomeColor  },
      { label: 'Expenses', data: cashflow.map((x) => x.expense), borderColor: expenseColor, backgroundColor: expenseColor + '14', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: expenseColor },
    ]},
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: cc.muted, font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } } } },
      scales: {
        x: { ticks: { color: cc.muted, font: { family: cc.mono, size: 10 } }, grid: { color: cc.grid } },
        y: { ticks: { color: cc.muted, font: { family: cc.mono, size: 10 }, callback: (v) => '$' + v.toLocaleString() }, grid: { color: cc.grid } },
      },
    },
  });
}

function drawSpendChart() {
  const ctx = $('spend-chart'); if (!ctx) return;
  const cc = getChartThemeA();
  charts['spend'] = new Chart(ctx, {
    type: 'polarArea',
    data: { labels: STORE.budgets.map((b) => b.category), datasets: [{ data: STORE.budgets.map((b) => b.spent), backgroundColor: STORE.budgets.map((b) => b.color + '99'), borderColor: STORE.budgets.map((b) => b.color), borderWidth: 1 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: cc.muted, font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 10, padding: 10 } } } },
  });
}

function drawSavingsChart() {
  const ctx = $('savings-chart'); if (!ctx) return;
  const cc = getChartThemeA();
  const cashflow = (STORE.summary && STORE.summary.cashflow) || [];
  const barColor = cc.dark ? 'rgba(204,126,64,0.7)' : 'rgba(192,107,48,0.65)';
  charts['savings'] = new Chart(ctx, {
    type: 'bar',
    data: { labels: cashflow.map((x) => x.month), datasets: [{ label: 'Saved', data: cashflow.map((x) => Math.max(0, x.income - x.expense)), backgroundColor: barColor, borderRadius: 6, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: cc.muted, font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } } } },
      scales: {
        x: { ticks: { color: cc.muted, font: { family: cc.mono, size: 10 } }, grid: { color: cc.grid } },
        y: { ticks: { color: cc.muted, font: { family: cc.mono, size: 10 }, callback: (v) => '$' + v.toLocaleString() }, grid: { color: cc.grid } },
      },
    },
  });
}

function drawDailyChart() {
  const ctx = $('daily-chart'); if (!ctx) return;
  const cc = getChartThemeA();
  const byDay = {};
  STORE.transactions.filter((t) => t.amount < 0).forEach((t) => { byDay[t.date] = (byDay[t.date] || 0) + Math.abs(t.amount); });
  const labels = Object.keys(byDay).sort().slice(-18);
  const data = labels.map((d) => Math.round(byDay[d]));
  const highColor = cc.dark ? 'rgba(224,112,96,0.8)'  : 'rgba(208,72,48,0.7)';
  const normColor = cc.dark ? 'rgba(204,126,64,0.65)' : 'rgba(192,107,48,0.6)';
  charts['daily'] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Daily Spend', data, backgroundColor: data.map((v) => v > 250 ? highColor : normColor), borderRadius: 4, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: cc.muted, font: { family: cc.mono, size: 10 }, maxRotation: 45 }, grid: { display: false } },
        y: { ticks: { color: cc.muted, font: { family: cc.mono, size: 10 }, callback: (v) => '$' + v }, grid: { color: cc.grid } },
      },
    },
  });
}

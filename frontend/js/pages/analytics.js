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

function drawTrendChart() {
  const ctx = $('trend-chart'); if (!ctx) return;
  const cashflow = (STORE.summary && STORE.summary.cashflow) || [];
  charts['trend'] = new Chart(ctx, { type: 'line', data: { labels: cashflow.map((x) => x.month), datasets: [{ label: 'Income', data: cashflow.map((x) => x.income), borderColor: '#CE9A52', backgroundColor: 'rgba(206,154,82,0.08)', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#CE9A52' }, { label: 'Expenses', data: cashflow.map((x) => x.expense), borderColor: '#E2825F', backgroundColor: 'rgba(226,130,95,0.08)', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#E2825F' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8C8174', font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } } } }, scales: { x: { ticks: { color: '#8C8174', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(247,243,236,0.04)' } }, y: { ticks: { color: '#8C8174', font: { family: 'JetBrains Mono', size: 11 }, callback: (v) => '$' + v.toLocaleString() }, grid: { color: 'rgba(247,243,236,0.06)' } } } } });
}
function drawSpendChart() {
  const ctx = $('spend-chart'); if (!ctx) return;
  charts['spend'] = new Chart(ctx, { type: 'polarArea', data: { labels: STORE.budgets.map((b) => b.category), datasets: [{ data: STORE.budgets.map((b) => b.spent), backgroundColor: STORE.budgets.map((b) => b.color + '99'), borderColor: STORE.budgets.map((b) => b.color), borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8C8174', font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 10, padding: 10 } } } } });
}
function drawSavingsChart() {
  const ctx = $('savings-chart'); if (!ctx) return;
  const cashflow = (STORE.summary && STORE.summary.cashflow) || [];
  charts['savings'] = new Chart(ctx, { type: 'bar', data: { labels: cashflow.map((x) => x.month), datasets: [{ label: 'Saved', data: cashflow.map((x) => Math.max(0, x.income - x.expense)), backgroundColor: 'rgba(204,131,80,0.7)', borderRadius: 6, borderSkipped: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8C8174', font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } } } }, scales: { x: { ticks: { color: '#8C8174', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(247,243,236,0.04)' } }, y: { ticks: { color: '#8C8174', font: { family: 'JetBrains Mono', size: 11 }, callback: (v) => '$' + v.toLocaleString() }, grid: { color: 'rgba(247,243,236,0.06)' } } } } });
}
function drawDailyChart() {
  const ctx = $('daily-chart'); if (!ctx) return;
  const byDay = {};
  STORE.transactions.filter((t) => t.amount < 0).forEach((t) => {
    byDay[t.date] = (byDay[t.date] || 0) + Math.abs(t.amount);
  });
  const labels = Object.keys(byDay).sort().slice(-18);
  const data = labels.map((d) => Math.round(byDay[d]));
  charts['daily'] = new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label: 'Daily Spend', data, backgroundColor: data.map((v) => (v > 250 ? 'rgba(226,130,95,0.8)' : 'rgba(204,131,80,0.65)')), borderRadius: 4, borderSkipped: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#8C8174', font: { family: 'JetBrains Mono', size: 10 }, maxRotation: 45 }, grid: { display: false } }, y: { ticks: { color: '#8C8174', font: { family: 'JetBrains Mono', size: 11 }, callback: (v) => '$' + v }, grid: { color: 'rgba(247,243,236,0.05)' } } } } });
}

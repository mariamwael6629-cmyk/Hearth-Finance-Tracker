// ============================================================
// REPORTS
// ============================================================
function renderReports(c) {
  const income = STORE.summary ? STORE.summary.monthly_income : 0;
  const expense = STORE.summary ? STORE.summary.monthly_expense : 0;
  const net = income - expense;
  const savingsRate = STORE.summary ? Math.round(STORE.summary.savings_rate) : 0;
  const subTotal = STORE.subscriptions.reduce((s, x) => s + x.amount, 0);
  const topCat = (STORE.summary && STORE.summary.category_breakdown[0]) || null;

  c.innerHTML = `
  <div class="stagger">
    <div class="card dash-panel grain" style="margin-bottom:22px;padding:24px">
      <div class="eyebrow" style="margin-bottom:12px">Financial Summary</div>
      <p style="font-size:15px;line-height:1.7;color:var(--ink-soft)">
        So far you've earned <strong style="color:var(--amber)">${fmt(income)}</strong> and spent <strong style="color:var(--coral)">${fmt(expense)}</strong>, netting <strong style="color:var(--copper-bright)">${fmt(Math.abs(net))}</strong> ${net >= 0 ? 'surplus' : 'deficit'}.
        ${topCat ? `Your largest spending category is <strong>${escapeHtml(topCat.category)}</strong> at ${fmt(topCat.amount)}.` : ''}
        Subscription costs total ${fmt(subTotal)}/month. Your savings rate of <strong>${savingsRate}%</strong> reflects your current spending habits.
      </p>
      <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
        ${[net >= 0 ? icon('check', 14) + ' Positive net flow' : icon('alert', 14) + ' Spending more than earning', savingsRate >= 20 ? icon('check', 14) + ' Healthy savings rate' : icon('alert', 14) + ' Low savings rate', icon('analytics', 14) + ' Track your progress'].map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
    <div class="report-grid">
      ${[
        [icon('chart', 22), 'Monthly Statement', 'Full income, expense, and category breakdown for any month.', 'PDF', 'CSV'],
        [icon('calendar', 22), 'Annual Report', 'Year-over-year comparison, tax summary, and savings analysis.', 'PDF', 'CSV'],
        [icon('target', 22), 'Goal Progress', 'Current savings progress with projections and milestones.', 'PDF', ''],
        [icon('card', 22), 'Transaction Export', 'Complete transaction history with filters.', '', 'CSV'],
        [icon('analytics', 22), 'Net Worth History', 'Asset and liability tracking over time.', 'PDF', 'CSV'],
        [icon('receipt', 22), 'Tax Summary', 'Deductible expenses, income categories for tax prep.', 'PDF', ''],
      ].map(([i, t, d, pdf, csv]) => `
      <div class="card report-card grain card-hover">
        <div class="report-icon">${i}</div>
        <h3>${t}</h3>
        <p>${d}</p>
        <div class="export-row">
          ${pdf ? `<button class="btn btn-primary btn-sm" onclick="toast('Generating PDF…','success')">${icon('download', 15)} PDF</button>` : ''}
          ${csv ? `<button class="btn btn-ghost btn-sm" onclick="exportTransactionsCsv()">${icon('download', 15)} CSV</button>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

function exportTransactionsCsv() {
  const rows = [['Date', 'Merchant', 'Category', 'Amount']];
  STORE.transactions.forEach((t) => rows.push([t.date, t.merchant, t.category, t.amount]));
  const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'hearth-transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
  toast('CSV exported', 'success');
}

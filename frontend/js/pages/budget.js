// ============================================================
// BUDGET PLANNER
// ============================================================
function renderBudget(c) {
  const totalBudget = STORE.budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = STORE.budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  c.innerHTML = `
  <div class="stagger">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:22px">
      <h3 style="font-family:var(--font-display);font-size:18px;font-weight:600">Your Budgets</h3>
      <button class="btn btn-primary btn-sm" onclick="openBudgetModal()">+ Add Category</button>
    </div>
    <div class="budget-totals">
      ${[['Total Budget', fmt(totalBudget)], ['Spent', fmt(totalSpent)], ['Remaining', fmt(remaining)]].map(([l, v], i) => `
      <div class="card budget-total-card grain">
        <div class="val" style="color:${i === 2 ? 'var(--amber)' : i === 1 ? 'var(--coral)' : 'var(--ink)'}">${v}</div>
        <div class="lbl">${l}</div>
      </div>`).join('')}
    </div>
    <div class="budget-grid">
      ${STORE.budgets.map((b) => {
        const pct = Math.min(100, (b.spent / (b.limit || 1)) * 100);
        const cls = pct >= 90 ? 'crit' : pct >= 70 ? 'warn' : 'ok';
        return `<div class="card budget-card grain card-hover">
          <div class="head">
            <div style="display:flex;align-items:center;gap:10px">
              <div class="tx-icon" style="width:38px;height:38px;border-radius:11px;font-size:17px">${b.icon}</div>
              <div><div style="font-weight:700;font-size:15px">${escapeHtml(b.category)}</div><div style="font-size:12px;color:var(--ink-muted)">${Math.round(pct)}% used</div></div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn-icon" style="width:32px;height:32px" onclick="openBudgetModal(${b.id})">✎</button>
              <button class="btn-icon" style="width:32px;height:32px" onclick="deleteBudget(${b.id})">✕</button>
            </div>
          </div>
          <div class="budget-row">
            <div class="meta">
              <span class="num" style="font-weight:700;color:${cls === 'crit' ? 'var(--coral)' : cls === 'warn' ? 'var(--amber)' : 'var(--copper-bright)'}">${fmt(b.spent)}</span>
              <span class="amounts muted">of ${fmt(b.limit)}</span>
            </div>
            <div class="budget-track"><div class="budget-fill ${cls}" style="width:${pct}%"></div></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-muted)">
            <span>${fmt(Math.max(0, b.limit - b.spent))} remaining</span>
            <span>${pct >= 90 ? '⚠️ Over budget' : pct >= 70 ? '⚡ Watch spending' : '✓ On track'}</span>
          </div>
        </div>`;
      }).join('') || `<div class="empty-state"><div class="empty-icon">◎</div><strong>No budgets yet</strong><p>Add a budget category to start tracking your spending.</p></div>`}
    </div>
  </div>`;
}

async function deleteBudget(id) {
  try {
    await api.delete(`/budgets/${id}`);
    await refreshData();
    toast('Budget deleted', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

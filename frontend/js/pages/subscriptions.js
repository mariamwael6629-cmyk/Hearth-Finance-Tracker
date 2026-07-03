// ============================================================
// SUBSCRIPTIONS
// ============================================================
function renderSubscriptions(c) {
  const total = STORE.subscriptions.reduce((s, sub) => s + sub.amount, 0);
  c.innerHTML = `
  <div class="stagger">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      ${[['Monthly Cost', fmt(total)], ['Annual Cost', fmt(total * 12)], ['Active', STORE.subscriptions.length + ' subscriptions']].map(([l, v]) => `
      <div class="card" style="padding:20px;text-align:center">
        <div style="font-size:12px;color:var(--ink-muted);margin-bottom:6px;text-transform:uppercase;font-weight:700;letter-spacing:.05em">${l}</div>
        <div style="font-family:var(--font-display);font-size:24px;font-weight:600;color:var(--copper-bright)">${v}</div>
      </div>`).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="font-family:var(--font-display);font-size:18px;font-weight:600">Active Subscriptions</h3>
      <button class="btn btn-primary btn-sm" onclick="openSubscriptionModal()">+ Add</button>
    </div>
    <div class="sub-grid">
      ${STORE.subscriptions.map((s) => `
      <div class="card sub-card grain card-hover">
        <div class="sub-logo">${s.icon}</div>
        <div class="sub-info" style="flex:1">
          <div class="name">${escapeHtml(s.name)}</div>
          <div class="cycle">${escapeHtml(s.cycle)} · ${escapeHtml(s.category)}</div>
          <div class="amount">${fmt(s.amount)}<span style="font-size:12px;color:var(--ink-faint)">/mo</span></div>
          <div class="next">Next charge: ${escapeHtml(s.next_charge)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <button class="btn-icon" style="border-radius:10px;flex-shrink:0" onclick="openSubscriptionModal(${s.id})">✎</button>
          <button class="btn-icon" style="border-radius:10px;flex-shrink:0" onclick="deleteSubscription(${s.id})">✕</button>
        </div>
      </div>`).join('') || `<div class="empty-state"><div class="empty-icon">↻</div><strong>No subscriptions yet</strong><p>Add a subscription to track recurring costs.</p></div>`}
    </div>
  </div>`;
}

async function deleteSubscription(id) {
  try {
    await api.delete(`/subscriptions/${id}`);
    await refreshData();
    toast('Subscription removed', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

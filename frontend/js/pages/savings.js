// ============================================================
// SAVINGS GOALS
// ============================================================
function renderSavings(c) {
  const totalSaved = STORE.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = STORE.goals.reduce((s, g) => s + g.target, 0);
  const avgProgress = STORE.goals.length ? Math.round(STORE.goals.reduce((s, g) => s + (g.saved / (g.target || 1)) * 100, 0) / STORE.goals.length) : 0;

  c.innerHTML = `
  <div class="stagger">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
      ${[['Total Saved', fmt(totalSaved), 'across all goals'], ['Total Goals', fmt(totalTarget), 'across all targets'], ['Avg Progress', avgProgress + '%', 'weighted average']].map(([l, v, s]) => `
      <div class="card" style="padding:22px">
        <div style="font-size:12px;color:var(--ink-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;font-weight:700">${l}</div>
        <div style="font-family:var(--font-display);font-size:26px;font-weight:600;color:var(--copper-bright);margin-bottom:4px">${v}</div>
        <div style="font-size:12.5px;color:var(--ink-faint)">${s}</div>
      </div>`).join('')}
    </div>
    <div class="goals-grid">
      ${STORE.goals.map((g) => {
        const pct = Math.min(100, Math.round((g.saved / (g.target || 1)) * 100));
        const r = 40;
        const circ = 2 * Math.PI * r;
        const offset = circ * (1 - pct / 100);
        return `<div class="card goal-card grain card-hover">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div class="g-icon">${g.icon}</div>
            <div class="ring-wrap" style="width:90px;height:90px">
              <svg width="90" height="90"><circle class="ring-track" cx="45" cy="45" r="${r}"/><circle class="ring-fill" cx="45" cy="45" r="${r}" stroke="url(#rg${g.id})" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/><defs><linearGradient id="rg${g.id}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#E0A06C"/><stop offset="100%" stop-color="#B5562E"/></linearGradient></defs></svg>
              <div class="ring-center"><span class="num" style="font-size:16px;font-weight:700;color:var(--copper-bright)">${pct}%</span></div>
            </div>
          </div>
          <div class="g-name">${escapeHtml(g.name)}</div>
          <div class="g-target">Target: ${fmt(g.target)}</div>
          <div class="g-amount">${fmt(g.saved)}</div>
          <div class="g-pct">saved of ${fmt(g.target)}</div>
          <div class="goal-track"><div class="goal-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="goal-eta">📅 Est. completion: ${escapeHtml(g.eta || '—')}</div>
            <div style="font-size:12.5px;color:var(--ink-muted)">+${fmt(g.monthly)}/mo</div>
          </div>
          <div style="margin-top:14px;display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" style="flex:1;justify-content:center" onclick="openContributeModal(${g.id})">+ Add funds</button>
            <button class="btn-icon" onclick="openGoalModal(${g.id})" style="border-radius:10px">✎</button>
            <button class="btn-icon" onclick="deleteGoal(${g.id})" style="border-radius:10px">✕</button>
          </div>
        </div>`;
      }).join('')}
      <div class="goal-add" onclick="openGoalModal()">
        <div style="font-size:32px">+</div>
        <div style="font-weight:700;font-size:15px">New Goal</div>
        <div style="font-size:13px">Set a target and start saving</div>
      </div>
    </div>
  </div>`;
}

async function deleteGoal(id) {
  try {
    await api.delete(`/goals/${id}`);
    await refreshData();
    toast('Goal deleted', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

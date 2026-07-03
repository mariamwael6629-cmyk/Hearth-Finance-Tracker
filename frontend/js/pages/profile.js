// ============================================================
// PROFILE
// ============================================================
function renderProfile(c) {
  const u = STORE.currentUser;
  c.innerHTML = `
  <div class="stagger" style="max-width:680px">
    <div class="card dash-panel grain" style="margin-bottom:20px">
      <div class="profile-hero">
        <div class="profile-avatar">${u.initials}</div>
        <div>
          <div style="font-family:var(--font-display);font-size:22px;font-weight:600;margin-bottom:4px">${escapeHtml(u.name)}</div>
          <div style="font-size:14px;color:var(--ink-muted);margin-bottom:10px">${escapeHtml(u.email)}</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <span class="tag">✦ Hearth Member</span>
          </div>
        </div>
      </div>
    </div>
    <form class="card settings-block grain" onsubmit="saveProfileInfo(this);return false;">
      <h3>Personal Information</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div class="input-wrap"><label>First name</label><input class="input" name="first_name" value="${escapeHtml(u.first_name)}" required></div>
        <div class="input-wrap"><label>Last name</label><input class="input" name="last_name" value="${escapeHtml(u.last_name)}" required></div>
        <div class="input-wrap"><label>Email</label><input class="input" name="email" type="email" value="${escapeHtml(u.email)}" required></div>
      </div>
      <button class="btn btn-primary btn-sm" type="submit">Save changes</button>
    </form>
    <form class="card settings-block grain" onsubmit="saveFinancialProfile(this);return false;">
      <h3>Financial Profile</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
        <div class="input-wrap select-wrap"><label>Base Currency</label><select class="input" name="currency">${Object.keys(CURRENCIES).map((k) => `<option ${u.currency === k ? 'selected' : ''}>${k}</option>`).join('')}</select></div>
        <div class="input-wrap"><label>Monthly Income</label><input class="input" name="monthly_income" type="number" step="0.01" value="${u.monthly_income}"></div>
        <div class="input-wrap"><label>Savings Target</label><input class="input" name="savings_target" type="number" step="0.01" value="${u.savings_target}"></div>
      </div>
      <button class="btn btn-primary btn-sm" type="submit">Save changes</button>
    </form>
  </div>`;
}

async function saveProfileInfo(formEl) {
  const data = Object.fromEntries(new FormData(formEl).entries());
  try {
    STORE.currentUser = await api.patch('/auth/me', data);
    toast('Profile updated ✦', 'success');
    render();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function saveFinancialProfile(formEl) {
  const data = Object.fromEntries(new FormData(formEl).entries());
  data.monthly_income = parseFloat(data.monthly_income) || 0;
  data.savings_target = parseFloat(data.savings_target) || 0;
  try {
    STORE.currentUser = await api.patch('/auth/me', data);
    toast('Financial profile updated ✦', 'success');
    render();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ============================================================
// SETTINGS
// ============================================================
function renderSettings(c) {
  const sections = {
    general: 'General', appearance: 'Appearance', notifications: 'Notifications', privacy: 'Privacy & Security',
  };
  c.innerHTML = `
  <div class="settings-layout stagger">
    <div class="card settings-nav grain" style="padding:12px;align-self:start">
      ${Object.entries(sections).map(([k, v]) => `
      <div class="s-nav-item ${STORE.settingsPage === k ? 'active' : ''}" onclick="STORE.settingsPage='${k}';renderSettings($('page-content'))">${v}</div>`).join('')}
    </div>
    <div class="settings-section">
      ${renderSettingsSection()}
    </div>
  </div>`;
}

function renderSettingsSection() {
  if (STORE.settingsPage === 'general') return `
  <div class="card settings-block grain">
    <h3>General Preferences</h3>
    <div class="setting-row">
      <div class="s-info"><div class="s-label">Default Currency</div><div class="s-desc">Choose your base currency for all displays</div></div>
      <select class="input" style="width:auto;max-width:140px" onchange="updateCurrency(this.value)">
        ${Object.keys(CURRENCIES).map((k) => `<option ${STORE.currency === k ? 'selected' : ''}>${k}</option>`).join('')}
      </select>
    </div>
    <div class="setting-row">
      <div class="s-info"><div class="s-label">Date Format</div><div class="s-desc">How dates are shown across the app</div></div>
      <select class="input" style="width:auto;max-width:140px"><option>YYYY-MM-DD</option><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option></select>
    </div>
    <div class="setting-row">
      <div class="s-info"><div class="s-label">First Day of Week</div><div class="s-desc">Customize your calendar start</div></div>
      <select class="input" style="width:auto;max-width:140px"><option>Sunday</option><option>Monday</option></select>
    </div>
  </div>`;
  if (STORE.settingsPage === 'appearance') return `
  <div class="card settings-block grain">
    <h3>Appearance</h3>
    <div class="setting-row">
      <div class="s-info"><div class="s-label">Theme</div><div class="s-desc">Choose between dark and light mode</div></div>
      <div style="display:flex;gap:10px">
        <button class="btn ${STORE.theme === 'dark' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="STORE.theme='dark';applyTheme('dark');render()">🌙 Dark</button>
        <button class="btn ${STORE.theme === 'light' ? 'btn-primary' : 'btn-ghost'} btn-sm" onclick="STORE.theme='light';applyTheme('light');render()">☀️ Light</button>
      </div>
    </div>
    ${[['Compact View', 'Show more data with less spacing'], ['Animated Charts', 'Enable smooth chart animations'], ['Show Account Balances', 'Display balances in sidebar']].map(([l, d], i) => `
    <div class="setting-row">
      <div class="s-info"><div class="s-label">${l}</div><div class="s-desc">${d}</div></div>
      <label class="toggle"><input type="checkbox" ${i !== 0 ? 'checked' : ''} onchange="toast('${l} updated ✦','info')"><div class="toggle-track"><div class="toggle-thumb"></div></div></label>
    </div>`).join('')}
  </div>`;
  if (STORE.settingsPage === 'notifications') return `
  <div class="card settings-block grain">
    <h3>Notifications</h3>
    ${[['Bill Reminders', 'Get notified before bills are due', true], ['Unusual Spending Alerts', 'AI detects spending anomalies', true], ['Weekly Summary', 'Receive a weekly financial recap', true], ['Goal Milestones', 'Celebrate when you hit savings targets', true], ['Budget Warnings', 'Alert when approaching budget limits', false], ['Monthly Reports', 'Automatic report generation', false]].map(([l, d, def]) => `
    <div class="setting-row">
      <div class="s-info"><div class="s-label">${l}</div><div class="s-desc">${d}</div></div>
      <label class="toggle"><input type="checkbox" ${def ? 'checked' : ''} onchange="toast('Notification preference updated ✦','info')"><div class="toggle-track"><div class="toggle-thumb"></div></div></label>
    </div>`).join('')}
  </div>`;
  if (STORE.settingsPage === 'privacy') return `
  <div class="card settings-block grain">
    <h3>Privacy & Security</h3>
    ${[['Two-Factor Authentication', 'Add an extra layer of security', false], ['Biometric Login', 'Use Face ID or fingerprint', false], ['Data Sharing', 'Share anonymous usage data to improve Hearth', false], ['Activity Logging', 'Keep a log of account logins', true]].map(([l, d, def]) => `
    <div class="setting-row">
      <div class="s-info"><div class="s-label">${l}</div><div class="s-desc">${d}</div></div>
      <label class="toggle"><input type="checkbox" ${def ? 'checked' : ''} onchange="toast('Security setting updated ✦','success')"><div class="toggle-track"><div class="toggle-thumb"></div></div></label>
    </div>`).join('')}
    <div class="setting-row" style="padding-top:20px;border-top:1px solid var(--border);margin-top:6px">
      <div class="s-info"><div class="s-label" style="color:var(--coral)">Delete Account</div><div class="s-desc">Permanently remove all your data</div></div>
      <button class="btn btn-ghost btn-sm" style="border-color:var(--coral);color:var(--coral)" onclick="toast('Please contact support to delete your account','warn')">Delete</button>
    </div>
  </div>`;
  return `<div class="card settings-block grain"><h3>${STORE.settingsPage}</h3><div class="empty-state"><div class="empty-icon">⚙️</div><strong>Settings panel coming soon</strong><p>This section is under construction.</p></div></div>`;
}

async function updateCurrency(value) {
  try {
    STORE.currentUser = await api.patch('/auth/me', { currency: value });
    toast('Currency updated ✦', 'success');
    render();
  } catch (e) {
    toast(e.message, 'error');
  }
}

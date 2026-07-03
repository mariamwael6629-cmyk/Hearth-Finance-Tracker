// ============================================================
// MODALS — generic shell + Add/Edit forms for all resources
// ============================================================
function openModal(title, bodyHtml, onSubmit) {
  closeModal();
  const scrim = el('div', 'modal-scrim');
  scrim.id = 'modal-scrim';
  scrim.onclick = (e) => { if (e.target === scrim) closeModal(); };
  scrim.innerHTML = `
    <div class="modal">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <h3 style="font-family:var(--font-display);font-size:19px;font-weight:600">${title}</h3>
        <button class="btn-icon" style="width:32px;height:32px" onclick="closeModal()">✕</button>
      </div>
      <form id="modal-form" class="auth-form">${bodyHtml}</form>
    </div>`;
  document.body.appendChild(scrim);
  const form = $('modal-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    onSubmit(Object.fromEntries(new FormData(form).entries()));
  };
}
function closeModal() {
  const s = $('modal-scrim');
  if (s) s.remove();
}

// ---------- TRANSACTION ----------
function openTransactionModal() {
  const accOptions = STORE.accounts.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join('');
  openModal('Add Transaction', `
    <div class="input-wrap"><label>Merchant</label><input class="input" name="merchant" required></div>
    <div class="input-wrap select-wrap"><label>Account</label><select class="input" name="account_id" required>${accOptions}</select></div>
    <div class="input-wrap"><label>Category</label><input class="input" name="category" required></div>
    <div class="input-wrap"><label>Date</label><input class="input" name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required></div>
    <div class="input-wrap"><label>Amount (negative for expense)</label><input class="input" name="amount" type="number" step="0.01" required></div>
    <div class="input-wrap"><label>Icon (emoji)</label><input class="input" name="icon" value="💳"></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Save transaction</button>
  `, async (data) => {
    try {
      await api.post('/transactions', {
        account_id: parseInt(data.account_id, 10),
        merchant: data.merchant,
        category: data.category,
        date: data.date,
        amount: parseFloat(data.amount),
        icon: data.icon || '💳',
        recurring: false,
      });
      closeModal();
      await refreshData();
      toast('Transaction added ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

// ---------- ACCOUNT ----------
function openAccountModal() {
  openModal('Add Account', `
    <div class="input-wrap"><label>Account name</label><input class="input" name="name" required></div>
    <div class="input-wrap select-wrap"><label>Type</label><select class="input" name="type">
      <option value="checking">Checking</option><option value="savings">Savings</option><option value="credit">Credit Card</option><option value="investment">Investment</option>
    </select></div>
    <div class="input-wrap"><label>Starting balance</label><input class="input" name="balance" type="number" step="0.01" value="0"></div>
    <div class="input-wrap"><label>Color</label><input class="input" name="color" type="color" value="#CC8350"></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Save account</button>
  `, async (data) => {
    try {
      await api.post('/accounts', { name: data.name, type: data.type, balance: parseFloat(data.balance) || 0, color: data.color });
      closeModal();
      await refreshData();
      toast('Account added ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

// ---------- BUDGET ----------
function openBudgetModal(id) {
  const b = id ? STORE.budgets.find((x) => x.id === id) : null;
  openModal(b ? 'Edit Budget' : 'Add Budget Category', `
    <div class="input-wrap"><label>Category</label><input class="input" name="category" value="${b ? escapeHtml(b.category) : ''}" required></div>
    <div class="input-wrap"><label>Monthly limit</label><input class="input" name="limit" type="number" step="0.01" value="${b ? b.limit : ''}" required></div>
    <div class="input-wrap"><label>Icon (emoji)</label><input class="input" name="icon" value="${b ? b.icon : '💰'}"></div>
    <div class="input-wrap"><label>Color</label><input class="input" name="color" type="color" value="${b ? b.color : '#CC8350'}"></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Save budget</button>
  `, async (data) => {
    try {
      const payload = { category: data.category, limit: parseFloat(data.limit), icon: data.icon || '💰', color: data.color };
      if (b) await api.patch(`/budgets/${b.id}`, payload);
      else await api.post('/budgets', { ...payload, spent: 0, month: '' });
      closeModal();
      await refreshData();
      toast('Budget saved ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

// ---------- GOAL ----------
function openGoalModal(id) {
  const g = id ? STORE.goals.find((x) => x.id === id) : null;
  openModal(g ? 'Edit Goal' : 'New Savings Goal', `
    <div class="input-wrap"><label>Goal name</label><input class="input" name="name" value="${g ? escapeHtml(g.name) : ''}" required></div>
    <div class="input-wrap"><label>Target amount</label><input class="input" name="target" type="number" step="0.01" value="${g ? g.target : ''}" required></div>
    <div class="input-wrap"><label>Monthly contribution</label><input class="input" name="monthly" type="number" step="0.01" value="${g ? g.monthly : ''}"></div>
    <div class="input-wrap"><label>Target date (optional)</label><input class="input" name="eta" placeholder="e.g. Dec 2026" value="${g ? escapeHtml(g.eta) : ''}"></div>
    <div class="input-wrap"><label>Icon (emoji)</label><input class="input" name="icon" value="${g ? g.icon : '🎯'}"></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Save goal</button>
  `, async (data) => {
    try {
      const payload = { name: data.name, target: parseFloat(data.target), monthly: parseFloat(data.monthly) || 0, eta: data.eta || '', icon: data.icon || '🎯' };
      if (g) await api.patch(`/goals/${g.id}`, payload);
      else await api.post('/goals', { ...payload, saved: 0 });
      closeModal();
      await refreshData();
      toast('Goal saved ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

function openContributeModal(id) {
  const g = STORE.goals.find((x) => x.id === id);
  if (!g) return;
  openModal(`Add funds to ${g.name}`, `
    <div class="input-wrap"><label>Amount</label><input class="input" name="amount" type="number" step="0.01" min="0.01" required></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Add funds</button>
  `, async (data) => {
    try {
      await api.post(`/goals/${id}/contribute`, { amount: parseFloat(data.amount) });
      closeModal();
      await refreshData();
      toast('Funds added ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

// ---------- SUBSCRIPTION ----------
function openSubscriptionModal(id) {
  const s = id ? STORE.subscriptions.find((x) => x.id === id) : null;
  openModal(s ? 'Edit Subscription' : 'Add Subscription', `
    <div class="input-wrap"><label>Name</label><input class="input" name="name" value="${s ? escapeHtml(s.name) : ''}" required></div>
    <div class="input-wrap"><label>Monthly amount</label><input class="input" name="amount" type="number" step="0.01" value="${s ? s.amount : ''}" required></div>
    <div class="input-wrap select-wrap"><label>Billing cycle</label><select class="input" name="cycle"><option ${s && s.cycle === 'Monthly' ? 'selected' : ''}>Monthly</option><option ${s && s.cycle === 'Annual' ? 'selected' : ''}>Annual</option></select></div>
    <div class="input-wrap"><label>Category</label><input class="input" name="category" value="${s ? escapeHtml(s.category) : ''}"></div>
    <div class="input-wrap"><label>Next charge date</label><input class="input" name="next_charge" placeholder="e.g. Jul 12" value="${s ? escapeHtml(s.next_charge) : ''}"></div>
    <div class="input-wrap"><label>Icon (emoji)</label><input class="input" name="icon" value="${s ? s.icon : '🔁'}"></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Save subscription</button>
  `, async (data) => {
    try {
      const payload = { name: data.name, amount: parseFloat(data.amount), cycle: data.cycle, category: data.category, next_charge: data.next_charge, icon: data.icon || '🔁' };
      if (s) await api.patch(`/subscriptions/${s.id}`, payload);
      else await api.post('/subscriptions', payload);
      closeModal();
      await refreshData();
      toast('Subscription saved ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

// ---------- BILL ----------
function openBillModal(id) {
  const b = id ? STORE.bills.find((x) => x.id === id) : null;
  openModal(b ? 'Edit Bill' : 'Add Bill', `
    <div class="input-wrap"><label>Name</label><input class="input" name="name" value="${b ? escapeHtml(b.name) : ''}" required></div>
    <div class="input-wrap"><label>Amount</label><input class="input" name="amount" type="number" step="0.01" value="${b ? b.amount : ''}" required></div>
    <div class="input-wrap"><label>Due day (1-31)</label><input class="input" name="due_day" type="number" min="1" max="31" value="${b ? b.due_day : '1'}" required></div>
    <div class="input-wrap"><label>Month label</label><input class="input" name="month" placeholder="e.g. Jul" value="${b ? escapeHtml(b.month) : ''}"></div>
    <div class="input-wrap select-wrap"><label>Status</label><select class="input" name="status"><option value="upcoming" ${b && b.status === 'upcoming' ? 'selected' : ''}>Upcoming</option><option value="paid" ${b && b.status === 'paid' ? 'selected' : ''}>Paid</option></select></div>
    <div class="input-wrap"><label>Icon (emoji)</label><input class="input" name="icon" value="${b ? b.icon : '🧾'}"></div>
    <button class="btn btn-primary" type="submit" style="width:100%;justify-content:center">Save bill</button>
  `, async (data) => {
    try {
      const payload = { name: data.name, amount: parseFloat(data.amount), due_day: parseInt(data.due_day, 10), month: data.month || '', status: data.status, icon: data.icon || '🧾' };
      if (b) await api.patch(`/bills/${b.id}`, payload);
      else await api.post('/bills', payload);
      closeModal();
      await refreshData();
      toast('Bill saved ✦', 'success');
    } catch (e) { toast(e.message, 'error'); }
  });
}

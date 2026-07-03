// ============================================================
// AUTH — register / login / logout / session bootstrap
// ============================================================
async function loadAllData() {
  const [accounts, transactions, budgets, goals, subscriptions, bills, summary] = await Promise.all([
    api.get('/accounts'),
    api.get('/transactions'),
    api.get('/budgets'),
    api.get('/goals'),
    api.get('/subscriptions'),
    api.get('/bills'),
    api.get('/dashboard/summary'),
  ]);
  STORE.accounts = accounts;
  STORE.transactions = transactions;
  STORE.budgets = budgets;
  STORE.goals = goals;
  STORE.subscriptions = subscriptions;
  STORE.bills = bills;
  STORE.summary = summary;
}

async function refreshData() {
  await loadAllData();
  render();
}

async function bootstrapSession() {
  const token = getToken();
  if (!token) { STORE.authLoading = false; render(); return; }
  try {
    STORE.currentUser = await api.get('/auth/me');
    await loadAllData();
    STORE.page = 'dashboard';
  } catch (e) {
    setToken(null);
    STORE.currentUser = null;
  }
  STORE.authLoading = false;
  render();
}

async function handleRegister(formEl) {
  const data = Object.fromEntries(new FormData(formEl).entries());
  if (data.password.length < 8) { STORE.authError = 'Password must be at least 8 characters.'; render(); return; }
  STORE.authError = '';
  try {
    const result = await api.post('/auth/register', {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      currency: data.currency || 'USD',
    });
    setToken(result.access_token);
    STORE.currentUser = result.user;
    await loadAllData();
    navigate('dashboard');
    toast(`Welcome to Hearth, ${STORE.currentUser.first_name}! ✦`, 'success');
  } catch (e) {
    STORE.authError = e.message;
    render();
  }
}

async function handleLogin(formEl) {
  const data = Object.fromEntries(new FormData(formEl).entries());
  STORE.authError = '';
  try {
    const result = await api.post('/auth/login', { email: data.email, password: data.password });
    setToken(result.access_token);
    STORE.currentUser = result.user;
    await loadAllData();
    navigate('dashboard');
    toast(`Welcome back, ${STORE.currentUser.first_name}! ✦`, 'success');
  } catch (e) {
    STORE.authError = e.message;
    render();
  }
}

function handleLogout() {
  setToken(null);
  STORE.currentUser = null;
  STORE.accounts = [];
  STORE.transactions = [];
  STORE.budgets = [];
  STORE.goals = [];
  STORE.subscriptions = [];
  STORE.bills = [];
  STORE.summary = null;
  navigate('landing');
  toast('You have been signed out', 'info');
}

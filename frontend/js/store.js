// ============================================================
// STORE — app state (populated from the backend API)
// ============================================================
const STORE = {
  theme: localStorage.getItem('hearth-theme') || 'light',
  page: 'landing',
  sidebarOpen: false,

  // auth
  currentUser: null,
  authLoading: true,
  authError: '',
  authMode: 'login',

  // data (loaded from API after login)
  accounts: [],
  transactions: [],
  budgets: [],
  goals: [],
  subscriptions: [],
  bills: [],
  summary: null,

  // UI filters
  settingsPage: 'general',
  txFilter: 'All',
  txSearch: '',
  txPage: 1,
  analyticsTab: 'monthly',

  get currency() {
    return (this.currentUser && this.currentUser.currency) || 'USD';
  },
};

const CURRENCIES = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'د.إ', INR: '₹', CAD: 'C$', AUD: 'A$' };

// ---- UTILITIES ----
const fmt = (n, abs = false) => {
  const sym = CURRENCIES[STORE.currency] || '$';
  const v = abs ? Math.abs(n) : n;
  return `${v < 0 && !abs ? '-' : ''}${sym}${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const $ = (id) => document.getElementById(id);
const el = (tag, cls, html = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
const navigate = (page) => { STORE.page = page; render(); window.scrollTo(0, 0); };
const toast = (msg, type = 'info') => {
  const c = $('toast-container');
  if (!c) return;
  const t = document.createElement('div'); t.className = 'toast';
  const colors = { info: 'var(--copper-bright)', success: 'var(--amber)', warn: 'var(--coral)', error: 'var(--coral)' };
  t.innerHTML = `<span class="toast-dot" style="background:${colors[type]}"></span><span>${escapeHtml(msg)}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
};
const applyTheme = (t) => { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('hearth-theme', t); };
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; };

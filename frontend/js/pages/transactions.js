// ============================================================
// TRANSACTIONS
// ============================================================
function renderTransactions(c) {
  const cats = ['All', ...new Set(STORE.transactions.map((t) => t.category))];
  const filtered = STORE.transactions.filter((t) => {
    const matchCat = STORE.txFilter === 'All' || t.category === STORE.txFilter;
    const matchSearch = !STORE.txSearch || t.merchant.toLowerCase().includes(STORE.txSearch.toLowerCase()) || t.category.toLowerCase().includes(STORE.txSearch.toLowerCase());
    return matchCat && matchSearch;
  });
  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(STORE.txPage, totalPages);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  c.innerHTML = `
  <div class="stagger">
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px">
      <div class="search-bar">
        <span style="color:var(--ink-faint)">⌕</span>
        <input type="text" placeholder="Search transactions…" value="${escapeHtml(STORE.txSearch)}" oninput="STORE.txSearch=this.value;STORE.txPage=1;renderTransactions($('page-content'))">
      </div>
      <button class="btn btn-primary btn-sm" onclick="openTransactionModal()">+ Add</button>
      <button class="btn btn-ghost btn-sm" onclick="toast('Transactions exported ✦','success')">↓ Export</button>
    </div>
    <div class="filter-bar">
      ${cats.map((cat) => `<button class="filter-chip ${STORE.txFilter === cat ? 'active' : ''}" onclick="STORE.txFilter='${escapeHtml(cat)}';STORE.txPage=1;renderTransactions($('page-content'))">${escapeHtml(cat)}</button>`).join('')}
    </div>
    <div class="tx-table-wrap">
      <table class="tx-table">
        <thead><tr>
          <th>Transaction</th><th>Category</th><th>Date</th><th>Account</th><th style="text-align:right">Amount</th><th></th>
        </tr></thead>
        <tbody>
          ${paged.length ? paged.map((t) => {
            const acc = STORE.accounts.find((a) => a.id === t.account_id);
            return `<tr>
              <td><div style="display:flex;align-items:center;gap:12px"><div class="tx-icon" style="width:36px;height:36px;border-radius:10px;font-size:16px">${t.icon}</div><div><div style="font-weight:700;font-size:14px">${escapeHtml(t.merchant)}</div>${t.recurring ? '<span class="badge badge-copper" style="font-size:10px;margin-top:2px">↻ Recurring</span>' : ''}</div></div></td>
              <td><span class="tag" style="font-size:12px">${escapeHtml(t.category)}</span></td>
              <td><span class="num muted" style="font-size:13px">${t.date}</span></td>
              <td><span style="font-size:13px;color:var(--ink-muted)">${acc ? escapeHtml(acc.name) : '—'}</span></td>
              <td style="text-align:right"><span class="tx-amount ${t.amount > 0 ? 'inc' : 'exp'} num">${t.amount > 0 ? '+' : ''}${fmt(t.amount)}</span></td>
              <td><button class="btn-icon" style="width:30px;height:30px" onclick="deleteTransaction(${t.id})" title="Delete">✕</button></td>
            </tr>`;
          }).join('') : `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🔍</div><strong>No transactions found</strong><p>Try adjusting your filters or search term.</p></div></td></tr>`}
        </tbody>
      </table>
      ${totalPages > 1 ? `<div class="pagination">
        <button class="page-btn" onclick="STORE.txPage=Math.max(1,STORE.txPage-1);renderTransactions($('page-content'))">‹</button>
        ${Array.from({ length: totalPages }, (_, i) => `<button class="page-btn ${page === i + 1 ? 'active' : ''}" onclick="STORE.txPage=${i + 1};renderTransactions($('page-content'))">${i + 1}</button>`).join('')}
        <button class="page-btn" onclick="STORE.txPage=Math.min(${totalPages},STORE.txPage+1);renderTransactions($('page-content'))">›</button>
      </div>` : ''}
    </div>
    <!-- Summary row -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:6px">
      ${[['Total Income', filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0), 'inc'], ['Total Expenses', Math.abs(filtered.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)), 'exp'], ['Net', filtered.reduce((s, t) => s + t.amount, 0), filtered.reduce((s, t) => s + t.amount, 0) >= 0 ? 'inc' : 'exp']].map(([l, v, cls]) => `
      <div class="card" style="padding:18px;text-align:center">
        <div style="font-size:12px;color:var(--ink-muted);margin-bottom:6px">${l}</div>
        <div class="num tx-amount ${cls}" style="font-size:20px">${l === 'Net' && v < 0 ? '-' : ''}${fmt(Math.abs(v))}</div>
      </div>`).join('')}
    </div>
  </div>`;
}

async function deleteTransaction(id) {
  try {
    await api.delete(`/transactions/${id}`);
    await refreshData();
    toast('Transaction deleted', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

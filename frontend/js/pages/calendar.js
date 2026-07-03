// ============================================================
// CALENDAR
// ============================================================
function renderCalendar(c) {
  const today = new Date();
  const year = today.getFullYear();
  const monthIdx = today.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const billDays = {};
  STORE.bills.forEach((b) => { billDays[b.due_day] = true; });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(`<div class="cal-day other-month"><div class="day-num"></div></div>`);
  for (let day = 1; day <= daysInMonth; day++) {
    const hasBill = billDays[day];
    cells.push(`<div class="cal-day ${day === today.getDate() ? 'today' : ''}">
      <div class="day-num">${day}</div>
      ${hasBill ? '<div class="cal-dot"></div>' : ''}
    </div>`);
  }

  c.innerHTML = `
  <div class="stagger">
    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:22px;align-items:start">
      <div>
        <div class="card dash-panel grain" style="margin-bottom:20px">
          <div class="panel-head"><h3>${monthNames[monthIdx]} ${year}</h3></div>
          <div class="cal-grid">
            ${dayNames.map((d) => `<div class="cal-day-label">${d}</div>`).join('')}
            ${cells.join('')}
          </div>
          <div style="display:flex;gap:16px;margin-top:14px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:7px;font-size:13px"><span style="width:9px;height:9px;border-radius:50%;background:var(--coral);display:inline-block"></span>Bill due</div>
            <div style="display:flex;align-items:center;gap:7px;font-size:13px"><span style="width:9px;height:9px;border-radius:50%;background:var(--copper-bright);display:inline-block"></span>Today</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card dash-panel grain">
          <div class="panel-head"><h3>Upcoming Bills</h3><button class="btn btn-ghost btn-sm" onclick="openBillModal()">+ Add</button></div>
          <div class="bill-list">
            ${STORE.bills.map((b) => `
            <div class="bill-item">
              <div class="bill-date"><div class="d">${b.due_day}</div><div class="m">${escapeHtml(b.month)}</div></div>
              <div style="font-size:20px">${b.icon}</div>
              <div class="bill-detail"><div class="n">${escapeHtml(b.name)}</div><div class="s">${b.status === 'paid' ? 'Paid' : `Due ${b.due_day} ${escapeHtml(b.month)}`}</div></div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                <span class="num" style="font-weight:700;font-size:15px">${fmt(b.amount)}</span>
                <span class="bill-status ${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
              </div>
              <button class="btn-icon" style="width:28px;height:28px;flex-shrink:0" onclick="deleteBill(${b.id})">✕</button>
            </div>`).join('') || `<div class="empty-state"><div class="empty-icon">▦</div><strong>No bills yet</strong><p>Add a bill reminder to stay on top of payments.</p></div>`}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

async function deleteBill(id) {
  try {
    await api.delete(`/bills/${id}`);
    await refreshData();
    toast('Bill removed', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

/* ─────────────────────────────────────────
   UOM Calculator — app.js
───────────────────────────────────────── */

let units = [
  "BOX","CTN","CON","JRC","KG","PAL","PC","SHB","SHU","SLU","SMU"
];

let uomEnabled = true;

/* ── UOM Toggle ── */
function toggleUom() {
  uomEnabled = !uomEnabled;
  applyUomMode();
  try { localStorage.setItem('uom-enabled', uomEnabled ? '1' : '0'); } catch(e) {}
}

function applyUomMode() {
  const btn = document.getElementById('uomToggle');

  // Show/hide all .uom-only elements
  document.querySelectorAll('.uom-only').forEach(el => {
    el.style.display = uomEnabled ? '' : 'none';
  });

  // Swap conv-grid layout: with UOM = 7-col, without = 2 inputs side by side
  const grid = document.getElementById('convGrid');
  if (uomEnabled) {
    grid.classList.remove('no-uom');
    document.getElementById('fromVal').placeholder = 'Denominator';
    document.getElementById('toVal').placeholder   = 'Numerator';
  } else {
    grid.classList.add('no-uom');
    document.getElementById('fromVal').placeholder = 'Denominator';
    document.getElementById('toVal').placeholder   = 'Numerator';
  }

  // Pill active = UOM is HIDDEN (toggle to hide)
  if (uomEnabled) btn.classList.remove('active');
  else            btn.classList.add('active');

  calc();
}

/* ── Selects ── */
function populateSelects() {
  ['fromUom','toUom'].forEach(id => {
    const sel  = document.getElementById(id);
    const prev = sel.value;
    sel.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
    if (units.includes(prev)) sel.value = prev;
  });
  if (!document.getElementById('fromUom').value) {
    document.getElementById('fromUom').value = 'KG';
    document.getElementById('toUom').value   = 'CTN';
  }
  syncCustTag();
  calc();
}

function syncCustTag() {
  document.getElementById('custUomTag').textContent =
    document.getElementById('toUom').value || '—';
}

/* ── Calculation ── */
function calc() {

  const fromVal = parseFloat(document.getElementById('fromVal').value);
  const toVal   = parseFloat(document.getElementById('toVal').value);
  const fromUom = document.getElementById('fromUom').value;
  const toUom   = document.getElementById('toUom').value;
  const custQty = parseFloat(document.getElementById('custQty').value);

  const resultLine = document.getElementById('resultLine');
  const warnBox    = document.getElementById('warnBox');

  if (isNaN(custQty) || isNaN(fromVal) || isNaN(toVal) || fromVal === 0 || toVal === 0) {
    resultLine.innerHTML = '<span class="r-empty">Enter a quantity above to see the result</span>';
    warnBox.classList.remove('show');
    return;
  }

  // Customer enters qty in toUom; result is in fromUom
  const ratio  = toVal / fromVal;
  const ansVal = custQty / ratio;
  const display = +ansVal.toFixed(6);

  if (uomEnabled) {
    resultLine.innerHTML =
      `<span class="r-qty">${custQty}</span>&nbsp;<span class="r-uom">${toUom}</span>` +
      `<span class="r-eq">=</span>` +
      `<span class="r-ans">${display}</span>&nbsp;<span class="r-auom">${fromUom}</span>`;
  } else {
    resultLine.innerHTML =
      `<span class="r-qty">${custQty}</span>` +
      `<span class="r-eq">=</span>` +
      `<span class="r-ans">${display}</span>`;
  }

  const eps = 1e-9;
  warnBox.classList.toggle('show', Math.abs(ansVal - Math.round(ansVal)) > eps);
}

/* ── Event Listeners ── */
['fromVal','toVal'].forEach(id =>
  document.getElementById(id).addEventListener('input', calc)
);
['fromUom','toUom'].forEach(id =>
  document.getElementById(id).addEventListener('change', () => { syncCustTag(); calc(); })
);
document.getElementById('custQty').addEventListener('input', calc);

/* ── Hamburger / Side Menu ── */
function toggleMenu() {
  const menu    = document.getElementById('sideMenu');
  const backdrop = document.getElementById('menuBackdrop');
  const isOpen  = menu.classList.contains('open');
  if (isOpen) closeMenu();
  else {
    menu.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    disableHamburger();
  }
}

function closeMenu() {
  document.getElementById('sideMenu').classList.remove('open');
  document.getElementById('menuBackdrop').classList.remove('open');
  document.body.style.overflow = '';
  enableHamburger();
}

/* ── Dark Mode ── */
function toggleTheme() {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('darkToggle').classList.toggle('active', !isDark);
  try { localStorage.setItem('uom-theme', isDark ? 'light' : 'dark'); } catch(e) {}
}

/* ── Manage Units Modal ── */
function disableHamburger() {
  document.getElementById('hamburgerBtn').classList.add('disabled');
}
function enableHamburger() {
  document.getElementById('hamburgerBtn').classList.remove('disabled');
}

function openManage() {
  renderGrid();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  disableHamburger();
}

function closeManage() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  populateSelects();
  enableHamburger();
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeManage();
});

let touchStartY = 0;
document.getElementById('modalBox').addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });
document.getElementById('modalBox').addEventListener('touchend', e => {
  if (e.changedTouches[0].clientY - touchStartY > 80) closeManage();
}, { passive: true });

/* ── Sortable Grid ── */
let dragSrcIdx = null;

function dragHandle() {
  return `<div class="drag-handle" title="Drag to reorder">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>`;
}

function saveUnits() {
  try { localStorage.setItem('uom-units', JSON.stringify(units)); } catch(e) {}
}

function renderGrid() {
  saveUnits();
  const grid = document.getElementById('uomGrid');
  grid.innerHTML = units.map((u, i) => `
    <div class="uom-item" draggable="true" data-idx="${i}">
      ${dragHandle()}
      <span class="uom-name">${u}</span>
      <button class="del-btn" data-idx="${i}" title="Remove">×</button>
    </div>`
  ).join('');

  grid.querySelectorAll('.uom-item').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragSrcIdx = parseInt(el.dataset.idx);
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      grid.querySelectorAll('.uom-item').forEach(x => x.classList.remove('drag-over'));
    });
    el.addEventListener('dragover', e => {
      e.preventDefault();
      grid.querySelectorAll('.uom-item').forEach(x => x.classList.remove('drag-over'));
      el.classList.add('drag-over');
    });
    el.addEventListener('drop', e => {
      e.preventDefault();
      const destIdx = parseInt(el.dataset.idx);
      if (dragSrcIdx === null || dragSrcIdx === destIdx) return;
      const moved = units.splice(dragSrcIdx, 1)[0];
      units.splice(destIdx, 0, moved);
      dragSrcIdx = null;
      renderGrid();
    });
  });

  grid.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      units.splice(parseInt(btn.dataset.idx), 1);
      renderGrid();
    });
  });

  let touchClone = null, touchOrigIdx = null;
  grid.querySelectorAll('.drag-handle').forEach(handle => {
    handle.addEventListener('touchstart', e => {
      const item = handle.closest('.uom-item');
      touchOrigIdx = parseInt(item.dataset.idx);
      touchClone = item.cloneNode(true);
      touchClone.style.cssText =
        `position:fixed;opacity:0.85;pointer-events:none;z-index:9999;` +
        `width:${item.offsetWidth}px;box-shadow:0 4px 16px rgba(0,0,0,0.2);`;
      document.body.appendChild(touchClone);
      item.classList.add('dragging');
      e.preventDefault();
    }, { passive: false });

    handle.addEventListener('touchmove', e => {
      if (!touchClone) return;
      const t = e.touches[0];
      touchClone.style.left = (t.clientX - touchClone.offsetWidth  / 2) + 'px';
      touchClone.style.top  = (t.clientY - touchClone.offsetHeight / 2) + 'px';
      const els = grid.querySelectorAll('.uom-item:not(.dragging)');
      els.forEach(x => x.classList.remove('drag-over'));
      els.forEach(x => {
        const r = x.getBoundingClientRect();
        if (t.clientY >= r.top && t.clientY <= r.bottom) x.classList.add('drag-over');
      });
      e.preventDefault();
    }, { passive: false });

    handle.addEventListener('touchend', () => {
      if (!touchClone) return;
      touchClone.remove();
      touchClone = null;
      const over = grid.querySelector('.uom-item.drag-over');
      if (over) {
        const destIdx = parseInt(over.dataset.idx);
        const moved = units.splice(touchOrigIdx, 1)[0];
        units.splice(destIdx, 0, moved);
      }
      grid.querySelectorAll('.uom-item').forEach(x =>
        x.classList.remove('dragging', 'drag-over')
      );
      renderGrid();
    }, { passive: false });
  });
}

/* ── Add Unit ── */
function addUnit() {
  const inp  = document.getElementById('newUomInput');
  const name = inp.value.trim();
  if (!name || units.includes(name)) { inp.value = ''; return; }
  units.push(name);
  inp.value = '';
  renderGrid();
}
document.getElementById('newUomInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addUnit();
});

/* ── Clear All ── */
function clearAll() {
  document.getElementById('fromVal').value = '';
  document.getElementById('toVal').value   = '';
  document.getElementById('custQty').value = '';
  syncCustTag();
  calc();
}

/* ── Security ── */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (e.key === 'F12') { e.preventDefault(); return false; }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
      ['I','i','J','j','C','c'].includes(e.key)) { e.preventDefault(); return false; }
  if ((e.ctrlKey || e.metaKey) && ['U','u'].includes(e.key)) { e.preventDefault(); return false; }
});

/* ── Init ── */
try {
  const savedTheme = localStorage.getItem('uom-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('darkToggle').classList.add('active');
  }
  const savedUom = localStorage.getItem('uom-enabled');
  if (savedUom === '0') {
    uomEnabled = false;
  }
  const savedUnits = localStorage.getItem('uom-units');
  if (savedUnits) {
    const parsed = JSON.parse(savedUnits);
    if (Array.isArray(parsed) && parsed.length > 0) units = parsed;
  }
} catch(e) {}

populateSelects();
applyUomMode();
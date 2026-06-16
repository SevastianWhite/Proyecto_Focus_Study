'use strict';

// ── State ──────────────────────────────────────────────────────────────────
const cfg = {
  focus:  SERVER_CONFIG.focus_minutes,
  brk:    SERVER_CONFIG.break_minutes,
  cycles: SERVER_CONFIG.cycles
};

const tmp = { ...cfg };

let mode      = 'focus';
let running   = false;
let interval  = null;
let remaining = cfg.focus * 60;
let totalTime = cfg.focus * 60;
let cycle     = 1;

const CIRCUMFERENCE = 2 * Math.PI * 88; // matches r=88 in SVG

// ── DOM refs ───────────────────────────────────────────────────────────────
const elDisplay     = document.getElementById('time-display');
const elLabel       = document.getElementById('time-label');
const elCounter     = document.getElementById('timer-counter');
const elNextUp      = document.getElementById('next-up-label');
const elDots        = document.getElementById('dots');
const elRing        = document.getElementById('ring-progress');
const elBtnStartTxt = document.getElementById('btn-start-text');
const elPlayIcon    = document.getElementById('play-icon');
const elModal       = document.getElementById('modal-overlay');

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function updateUI() {
  elDisplay.textContent = fmt(remaining);
  elLabel.textContent   = mode === 'focus' ? 'Enfoque' : 'Descanso';
  elCounter.textContent = 'Pomodoro ' + cycle + '/' + cfg.cycles;

  if (mode === 'focus') {
    elNextUp.textContent = 'Descanso corto (' + cfg.brk + ' min)';
  } else {
    elNextUp.textContent = cycle === cfg.cycles
      ? 'Descanso largo (15–30 min)'
      : 'Enfoque (' + cfg.focus + ' min)';
  }

  const pct    = remaining / totalTime;
  const offset = CIRCUMFERENCE * (1 - pct);
  elRing.style.strokeDasharray  = CIRCUMFERENCE;
  elRing.style.strokeDashoffset = offset;
  elRing.classList.toggle('break-mode', mode === 'break');

  renderDots();
}

function renderDots() {
  elDots.innerHTML = '';
  for (let i = 1; i <= cfg.cycles; i++) {
    const dot = document.createElement('span');
    dot.setAttribute('aria-hidden', 'true');
    if (i < cycle) {
      dot.className = 'dot dot--done';
    } else if (i === cycle) {
      dot.className = mode === 'focus' ? 'dot dot--active' : 'dot dot--active-break';
    } else {
      dot.className = 'dot';
    }
    elDots.appendChild(dot);
  }
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Timer controls ─────────────────────────────────────────────────────────
function toggleTimer() {
  if (running) {
    clearInterval(interval);
    running = false;
    elBtnStartTxt.textContent = 'Reanudar';
    elPlayIcon.innerHTML = '&#9658;';
  } else {
    running = true;
    elBtnStartTxt.textContent = 'Pausar';
    elPlayIcon.innerHTML = '&#10073;&#10073;';
    interval = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        updateUI();
      } else {
        clearInterval(interval);
        running = false;
        elBtnStartTxt.textContent = 'Iniciar';
        elPlayIcon.innerHTML = '&#9658;';
        advancePhase();
      }
    }, 1000);
  }
}

function advancePhase() {
  if (mode === 'focus') {
    mode      = 'break';
    remaining = cfg.brk * 60;
    totalTime = cfg.brk * 60;
    showToast('¡Buen trabajo! Tiempo de descanso ☕');
  } else {
    mode = 'focus';
    if (cycle < cfg.cycles) {
      cycle++;
    } else {
      cycle = 1;
      showToast('¡Sesión completa! Excelente trabajo 🎉');
    }
    remaining = cfg.focus * 60;
    totalTime = cfg.focus * 60;
  }
  updateUI();
}

function resetTimer() {
  clearInterval(interval);
  running   = false;
  mode      = 'focus';
  cycle     = 1;
  remaining = cfg.focus * 60;
  totalTime = cfg.focus * 60;
  elBtnStartTxt.textContent = 'Iniciar';
  elPlayIcon.innerHTML = '&#9658;';
  updateUI();
}

function skipPhase() {
  clearInterval(interval);
  running = false;
  elBtnStartTxt.textContent = 'Iniciar';
  elPlayIcon.innerHTML = '&#9658;';
  advancePhase();
}

// ── Settings modal ───────────────────────────────────────────────────────
function openSettings() {
  tmp.focus  = cfg.focus;
  tmp.brk    = cfg.brk;
  tmp.cycles = cfg.cycles;
  document.getElementById('inp-focus').textContent  = tmp.focus;
  document.getElementById('inp-break').textContent  = tmp.brk;
  document.getElementById('inp-cycles').textContent = tmp.cycles;
  elModal.classList.add('show');
}

function closeSettings(event) {
  // Si se hizo click en el overlay (no en la tarjeta), cerramos.
  if (event && event.target !== elModal) return;
  elModal.classList.remove('show');
}

const LIMITS = {
  focus:  [1, 60],
  brk:    [1, 30],
  cycles: [1, 10]
};

function adjust(key, delta) {
  const [min, max] = LIMITS[key];
  tmp[key] = Math.min(Math.max(tmp[key] + delta, min), max);
  const idMap = { focus: 'inp-focus', brk: 'inp-break', cycles: 'inp-cycles' };
  document.getElementById(idMap[key]).textContent = tmp[key];
}

function applySettings() {
  const payload = {
    focus_minutes: tmp.focus,
    break_minutes: tmp.brk,
    cycles:        tmp.cycles
  };

  fetch('/api/config', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(data => {
    if (data.status === 'ok') {
      cfg.focus  = data.config.focus_minutes;
      cfg.brk    = data.config.break_minutes;
      cfg.cycles = data.config.cycles;
      elModal.classList.remove('show');
      resetTimer();
      showToast('Configuración aplicada ✓');
    }
  })
  .catch(() => showToast('Error al guardar la configuración'));
}

// ── Notas y meta de estudio (autosave con debounce) ─────────────────────
let saveNotesTimeout = null;

function scheduleSaveNotes() {
  clearTimeout(saveNotesTimeout);
  saveNotesTimeout = setTimeout(saveNotes, 600);
}

function saveNotes() {
  const goal  = document.getElementById('study-goal').value;
  const notes = document.getElementById('quick-notes').value;

  fetch('/api/notes', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ goal, notes })
  }).catch(() => {});
}

document.getElementById('study-goal').addEventListener('input', scheduleSaveNotes);
document.getElementById('quick-notes').addEventListener('input', scheduleSaveNotes);

// ── Init ───────────────────────────────────────────────────────────────────
updateUI();

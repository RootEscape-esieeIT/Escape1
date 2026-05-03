/* ===================== NARRATION ===================== */
let currentSlide = 1;
const TOTAL_SLIDES = 4;
let narrationTimer = null;

function startNarration() { showSlide(1); scheduleNext(); }

function scheduleNext() {
  if (currentSlide < TOTAL_SLIDES) {
    narrationTimer = setTimeout(function () {
      currentSlide++;
      showSlide(currentSlide);
      if (currentSlide < TOTAL_SLIDES) scheduleNext();
    }, 4000);
  }
}

function showSlide(n) {
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const slide = document.getElementById('slide-' + i);
    const dot   = document.getElementById('dot-' + i);
    if (slide) slide.classList.toggle('active', i === n);
    if (dot) {
      dot.classList.toggle('active', i === n);
      dot.classList.toggle('done',   i < n);
    }
  }
  currentSlide = n;
}

function skipToSlide(n) { clearTimeout(narrationTimer); showSlide(n); }

function startGame() {
  clearTimeout(narrationTimer);
  document.getElementById('screen-narration').classList.remove('active');
  document.getElementById('screen-game').classList.add('active');
  document.title = 'GITHYRULE · Incident de sécurité';
  initGame(window._playerPassword || '');
}

/* ===================== GAME ===================== */
let timeLeft = 300;
let countdownInterval = null;

const ENIGMAS = {
  livre:     false,
  film:      false,
  youtube:   false,
  wikipedia: false,
};

let COMPUTED_FINAL_PASSWORD = null;

function calculateSurvivalTime(password) {
  if (!password) return 60;
  if (/^\d+$/.test(password)) {
    return password.length <= 4 ? 20 : 60;
  }
  return Math.min(password.length * 15, 600);
}

function initGame(password) {
  timeLeft = calculateSurvivalTime(password);

  // Timer invisible — le joueur ne sait pas combien de temps il lui reste
  const timerEl = document.getElementById('gh-timer');
  if (timerEl) timerEl.style.display = 'none';

  addLog('Integrity check failed on core system.');
  addLog('Navigation module data corrupted — read access only.');
  addLog('───────────────────────────────────────────────');
  addLog('MISSION : Trouvez le mot de passe cryptographique.');
  addLog('ÉTAPE 1 : Résolvez les 4 épreuves dans les fichiers ci-dessous.');
  addLog('ÉTAPE 2 : Les indices révèlent une image SVG sur Wikimedia.');
  addLog('ÉTAPE 3 : Exécutez crypt.py sur cette image pour le mot de passe final.');
  addLog('───────────────────────────────────────────────');

  countdownInterval = setInterval(function () {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      systemLockdown();
    }
  }, 1000);
}

function markEnigmaDone(enigmaKey) {
  if (!ENIGMAS.hasOwnProperty(enigmaKey)) return;
  ENIGMAS[enigmaKey] = true;

  const badge = document.getElementById('badge-' + enigmaKey);
  if (badge) {
    badge.textContent = '✅ Résolu';
    badge.classList.remove('err');
    badge.style.color = '#3fb950';
  }

  const msgs = {
    livre:     ['✅ livre.html résolu — mot secret : PIXEL.', '💡 PIXEL = PixelApple.svg sur Wikimedia Commons.'],
    film:      ['✅ film.html résolu — BLANCHE-NEIGE confirmée.', '🍎 La pomme empoisonnée. Même symbole qu\'Apple.'],
    youtube:   ['✅ youtube.html résolu — code : 23-06-1912.', '📅 23 juin 1912 = naissance d\'Alan Turing. La pomme empoisonnée.'],
    wikipedia: ['✅ wikipedia.html résolu — chaîne : Newton.', '🍎 Isaac Newton + la pomme. Tout converge.'],
  };
  (msgs[enigmaKey] || ['✅ Énigme "' + enigmaKey + '" résolue.']).forEach(m => addLog(m));
  checkAllEnigmasDone();
}

function checkAllEnigmasDone() {
  if (!Object.values(ENIGMAS).every(v => v === true)) return;

  addLog('───────────────────────────────────────────────');
  addLog('🔓 Toutes les énigmes résolues. La clé : PixelApple.svg');
  addLog('▶ Lancez crypt.py avec : https://upload.wikimedia.org/wikipedia/commons/8/84/PixelApple.svg');
  addLog('▶ Entrez le mot de passe (30 chars) ci-dessous pour terminer.');

  const sz = document.getElementById('solution-zone');
  if (sz) {
    sz.style.display = 'block';
    sz.scrollIntoView({ behavior: 'smooth' });
  }
}

async function checkFinalCode() {
  const input = document.getElementById('solution-input').value.trim();
  if (!input) return;

  addLog('Vérification cryptographique en cours...');

  try {
    const svgUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/84/PixelApple.svg';
    const resp = await fetch(svgUrl);
    if (!resp.ok) throw new Error('SVG inaccessible');
    const text = await resp.text();
    const normalized = text.replace(/\s+/g, '');
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const b64 = btoa(String.fromCharCode(...hashArray));
    const clean = b64.replace(/\+/g, 'X').replace(/\//g, 'Y');
    COMPUTED_FINAL_PASSWORD = clean.slice(0, 30);
  } catch (e) {
    addLog('⚠ Impossible de contacter le serveur. Vérification locale impossible.');
    if (input.length === 30 && /^[A-Za-z0-9XY]+$/.test(input)) {
      triggerWin();
    } else {
      addLog('Format invalide (30 caractères alphanumériques attendus).');
    }
    return;
  }

  if (input === COMPUTED_FINAL_PASSWORD) {
    addLog('✅ Hash validé. Identité cryptographique confirmée.');
    triggerWin();
  } else {
    addLog('Code incorrect. Relancez crypt.py avec le bon fichier SVG.');
    const inp = document.getElementById('solution-input');
    inp.style.borderBottomColor = 'var(--gh-red)';
    setTimeout(() => { inp.style.borderBottomColor = ''; }, 1000);
  }
}

function addLog(text) {
  const logBox = document.getElementById('logs');
  if (!logBox) return;
  const entry = document.createElement('div');
  const ts = new Date().toISOString().substring(11, 19);
  entry.textContent = '[' + ts + '] ' + text;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}

function openModule(fileName) {
  const pages = {
    livre:     'livre.html',
    film:      'film.html',
    youtube:   'youtube.html',
    wikipedia: 'wikipedia.html',
  };
  if (pages[fileName]) {
    addLog('Ouverture de ' + fileName + '.html dans un environnement sandbox...');
    window.open(pages[fileName], '_blank');
  } else {
    addLog('Accès refusé : fichier verrouillé par le processus système.');
  }
}

/* ── Polling localStorage pour détecter les énigmes résolues ── */
setInterval(function () {
  ['livre', 'film', 'youtube', 'wikipedia'].forEach(function (key) {
    const val = localStorage.getItem('enigme_' + key);
    if (val === 'done' && !ENIGMAS[key]) {
      localStorage.removeItem('enigme_' + key);
      markEnigmaDone(key);
    }
  });
}, 1000);

/* ── Game over : écran de lockdown sans alert() ── */
function systemLockdown() {
  clearInterval(countdownInterval);
  window.location.href = 'gameover.html';
}

/* ── Victoire ── */
function triggerWin() {
  clearInterval(countdownInterval);
  window.location.href = 'win.html';
}
/* ===================== GAME ===================== */
let timeLeft = 300;
let countdownInterval = null;

const ENIGMAS = {
  livre: false,
  film: false,
  youtube: false,
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

  // Masquer le timer — le joueur ne doit pas savoir combien de temps il lui reste
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

  countdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) { clearInterval(countdownInterval); systemLockdown(); }
  }, 1000);
}

function markEnigmaDone(enigmaKey) {
  if (!ENIGMAS.hasOwnProperty(enigmaKey)) return;
  ENIGMAS[enigmaKey] = true;

  const badge = document.getElementById('badge-' + enigmaKey);
  if (badge) { badge.textContent = '✅ Résolu'; badge.classList.remove('err'); badge.style.color = '#3fb950'; }

  const msgs = {
    livre:     ['✅ livre.html résolu — mot secret : PIXEL.', '💡 PIXEL = PixelApple.svg sur Wikimedia Commons.'],
    film:      ['✅ film.html résolu — BLANCHE-NEIGE confirmée.', '🍎 La pomme empoisonnée. Même symbole qu\'Apple.'],
    youtube:   ['✅ youtube.html résolu — code : 23-06-1912.', '📅 23 juin 1912 = naissance d\'Alan Turing. La pomme empoisonnée.'],
    wikipedia: ['✅ wikipedia.html résolu — chaîne : Newton.', '🍎 Isaac Newton + la pomme. Tout converge.'],
  };
  (msgs[enigmaKey] || [`✅ Énigme "${enigmaKey}" résolue.`]).forEach(m => addLog(m));
  checkAllEnigmasDone();
}

function checkAllEnigmasDone() {
  const allDone = Object.values(ENIGMAS).every(v => v === true);
  if (allDone) {
    addLog('───────────────────────────────────────────────');
    addLog('🔓 Toutes les énigmes résolues. La clé : PixelApple.svg');
    addLog('▶ Lancez crypt.py avec : https://upload.wikimedia.org/wikipedia/commons/8/84/PixelApple.svg');
    addLog('▶ Entrez le mot de passe (30 chars) ci-dessous pour terminer.');
    document.getElementById('solution-zone').style.display = 'block';
    document.getElementById('solution-zone').scrollIntoView({ behavior: 'smooth' });
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
    addLog('Assurez-vous d\'avoir le bon mot de passe de crypt.py.');
    if (input.length === 30 && /^[A-Za-z0-9XY]+$/.test(input)) {
      triggerWin();
    } else {
      addLog('Format de mot de passe invalide (30 caractères alphanumériques attendus).');
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
  const entry  = document.createElement('div');
  const ts     = new Date().toISOString().substring(11, 19);
  entry.textContent = `[${ts}] ${text}`;
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
    addLog(`Ouverture de ${fileName}.html dans un environnement sandbox...`);
    window.open(pages[fileName], '_blank');
  } else {
    addLog('Accès refusé : fichier verrouillé par le processus système.');
  }
}

// Polling localStorage — détection résolution des épreuves
const _poll = setInterval(() => {
  ['livre', 'film', 'youtube', 'wikipedia'].forEach(key => {
    const val = localStorage.getItem('enigme_' + key);
    if (val === 'done' && !ENIGMAS[key]) {
      localStorage.removeItem('enigme_' + key);
      markEnigmaDone(key);
    }
  });
}, 1000);

function systemLockdown() {
  addLog('FATAL: Suppression des données initiée. Délai expiré.');
  alert('Délai expiré. Accès révoqué. Tous vos dépôts ont été supprimés.');
  location.reload();
}

function triggerWin() {
  clearInterval(countdownInterval);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-victory').classList.add('active');
  document.title = 'GITHYRULE · Accès restauré';
}

/* ===================== GAME ===================== */
let timeLeft = 300;
let totalTime = 300;
let countdownInterval = null;
let hackerInterval = null;
let playerPassword = "";

const ENIGMAS = {
  livre: false,
  film: false,
  youtube: false,
  wikipedia: false,
  cardan: false,
};

let COMPUTED_FINAL_PASSWORD = null;

function calculateSurvivalTime(password) {
  if (!password) return 2;

  let entropy = 0;
  const len = password.length;
  let poolSize = 0;

  // Calcul de la base des caractères (pool size)
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) poolSize = 1;

  // Entropie brute de Shannon
  entropy = len * Math.log2(poolSize);

  // 1. Pénalité des mots courants (Dictionnaires et claviers)
  const lower = password.toLowerCase();
  const badPatterns = ['password', 'motdepasse', 'admin', 'azerty', 'qwerty', '1234', '1111', '0000', 'soleil', 'amour'];
  if (badPatterns.some(p => lower.includes(p))) {
    entropy -= 20; // Grosse pénalité
  }

  // 2. Pénalité des caractères répétés ou qui se suivent ("aaa", "abc", "123")
  let seqCount = 0;
  let repCount = 0;
  for (let i = 0; i < len - 1; i++) {
    const code1 = password.charCodeAt(i);
    const code2 = password.charCodeAt(i + 1);
    if (code1 === code2) repCount++;
    if (code2 === code1 + 1 || code2 === code1 - 1) seqCount++;
  }
  entropy -= (repCount * 4 + seqCount * 3);

  if (entropy < 0) entropy = 0;

  // Calcul du temps : Courbe exponentielle pour bien récompenser les mots de passe robustes
  // Une entropie de 60 (~10 caractères mixtes) donnera environ 30 minutes.
  // Une entropie >= 80 donnera le maximum (4 heures).
  let timeInSeconds = Math.floor(2 * Math.pow(1.12, entropy));

  // Borner entre 2 secondes et 4 heures (14400 secondes)
  return Math.max(2, Math.min(timeInSeconds, 14400));
}

function initGame(password) {
  playerPassword = password || "123456";
  totalTime = calculateSurvivalTime(playerPassword);
  timeLeft = totalTime;

  addLog('Integrity check failed on core system.');
  addLog('Navigation module data corrupted — read access only.');
  addLog('Inspect corrupted files below to begin recovery.');

  document.getElementById('hacker-overlay').style.display = 'flex';
  startHackerAnimation();

  countdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft === 60) addLog('⚠ Système instable. Agissez rapidement.');
    if (timeLeft === 30) addLog('⚠⚠ Corruption critique. Dernière chance.');
    if (timeLeft <= 0) { clearInterval(countdownInterval); systemLockdown(); }
  }, 1000);
}

function markEnigmaDone(enigmaKey) {
  if (!ENIGMAS.hasOwnProperty(enigmaKey)) return;
  ENIGMAS[enigmaKey] = true;

  const badge = document.getElementById('badge-' + enigmaKey);
  if (badge) { badge.textContent = '✅ Résolu'; badge.classList.remove('err'); badge.style.color = '#3fb950'; }

  const msgs = {
    livre: ['✅ livre.html résolu.'],
    film: ['✅ film.html résolu — BLANCHE-NEIGE confirmée.', '🍎 La pomme empoisonnée. Même symbole qu\'Apple.'],
    youtube: ['✅ youtube.html résolu — code : 23-06-1912.', '📅 23 juin 1912 = naissance d\'Alan Turing. La pomme empoisonnée.'],
    wikipedia: ['✅ wikipedia.html résolu — chaîne : Newton.', '🍎 Isaac Newton + la pomme. Tout converge.'],
    cardan: ['✅ cardan.html résolu — stéganographie déchiffrée.', '👁️ Ce qui est caché est révélé.'],
  };
  (msgs[enigmaKey] || [`✅ Énigme "${enigmaKey}" résolue.`]).forEach(m => addLog(m));
  checkAllEnigmasDone();
}

function checkAllEnigmasDone() {
  const allDone = Object.values(ENIGMAS).every(v => v === true);
  if (allDone) {
    addLog('───────────────────────────────────────────────');
    addLog('🔓 Toutes les énigmes résolues.');
    addLog('🔓 Toutes les énigmes résolues.');
    addLog('▶ Entrez le mot de passe (30 chars) ci-dessous pour terminer.');
    document.getElementById('solution-zone').style.display = 'block';
    document.getElementById('solution-zone').scrollIntoView({ behavior: 'smooth' });
  }
}

async function checkFinalCode() {
  const input = document.getElementById('solution-input').value.trim();
  if (!input) return;

  addLog('Vérification cryptographique en cours...');

  COMPUTED_FINAL_PASSWORD = "oLs2BAdd3jp9EKZs9iGPLLTiFdJ68k"; // Hash attendu pour Apple_logo_black.svg

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
  const entry = document.createElement('div');
  const ts = new Date().toISOString().substring(11, 19);
  entry.textContent = `[${ts}] ${text}`;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}

function openModule(fileName) {
  const pages = {
    livre: 'livre.html',
    film: 'film.html',
    youtube: 'youtube.html',
    wikipedia: 'wikipedia.html',
    cardan: 'cardan.html',
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
  ['livre', 'film', 'youtube', 'wikipedia', 'cardan'].forEach(key => {
    const val = localStorage.getItem('enigme_' + key);
    if (val === 'done' && !ENIGMAS[key]) {
      localStorage.removeItem('enigme_' + key);
      markEnigmaDone(key);
    }
  });
}, 1000);

function systemLockdown() {
  addLog('FATAL: Suppression des données initiée. Délai expiré.');
  window.location.href = 'gameover.html';
}

function triggerWin() {
  clearInterval(countdownInterval);
  clearInterval(hackerInterval);
  document.getElementById('hacker-overlay').style.display = 'none';
  window.location.href = 'win.html';
}

function startHackerAnimation() {
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const overlay = document.getElementById('hacker-overlay');
  const pctEl = document.getElementById('hacker-pct');
  const barEl = document.getElementById('hacker-bar');
  const gridEl = document.getElementById('hacker-grid');
  const statusEl = document.getElementById('hacker-status');

  const phase1Duration = Math.min(8, totalTime * 0.15) * 1000; // max 8 sec ou 15% du temps
  const startTime = Date.now();
  let fakeProgress = 0;

  // Génération de l'ordre de déverrouillage aléatoire
  const actualLen = playerPassword.length;
  let lockOrder = Array.from({ length: actualLen }, (_, i) => i);
  for (let i = lockOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lockOrder[i], lockOrder[j]] = [lockOrder[j], lockOrder[i]];
  }

  hackerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(hackerInterval);
      return;
    }

    const elapsed = Date.now() - startTime;
    const realProgress = Math.min(1, elapsed / (totalTime * 1000));

    // Bruit sur la jauge
    fakeProgress += (Math.random() * 0.015 - 0.005);
    if (fakeProgress < realProgress) fakeProgress += 0.01;
    if (fakeProgress > realProgress + 0.03) fakeProgress -= 0.02;
    fakeProgress = Math.max(0, Math.min(1, fakeProgress));

    pctEl.textContent = Math.floor(fakeProgress * 100) + '%';
    barEl.style.width = (fakeProgress * 100) + '%';

    if (elapsed < phase1Duration) {
      statusEl.textContent = 'ANALYSING ENTROPY... PROBING LENGTH.';
      const randomLen = Math.floor(Math.random() * 8) + 4;
      let gridHtml = '';
      for (let i = 0; i < randomLen; i++) {
        if (Math.random() < 0.4) gridHtml += '_';
        else gridHtml += charPool[Math.floor(Math.random() * charPool.length)];
      }
      gridEl.innerHTML = gridHtml;
    } else {
      statusEl.textContent = 'LENGTH ACQUIRED. BRUTE-FORCING...';
      const crackProgress = Math.min(1, (elapsed - phase1Duration) / (totalTime * 1000 - phase1Duration));

      const lockedCount = Math.floor(crackProgress * actualLen);
      const currentlyLocked = new Set(lockOrder.slice(0, lockedCount));

      let gridHtml = '';
      for (let i = 0; i < actualLen; i++) {
        if (currentlyLocked.has(i)) {
          gridHtml += `<span class="hacker-locked-char">${playerPassword[i]}</span>`;
        } else {
          gridHtml += charPool[Math.floor(Math.random() * charPool.length)];
        }
      }
      gridEl.innerHTML = gridHtml;

      if (crackProgress >= 1) {
        statusEl.textContent = 'PASSWORD CRACKED. SYSTEM COMPROMISED.';
        gridEl.innerHTML = playerPassword.split('').map(c => `<span class="hacker-locked-char">${c}</span>`).join('');
      }
    }
  }, 80);
}

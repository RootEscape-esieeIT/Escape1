/* ===================== AUTH ===================== */
function doLogin() {
  const user = document.getElementById('input-user').value.trim();
  const pass = document.getElementById('input-pass').value;
  if (user === '') { alert('Veuillez entrer votre identifiant.'); return; }

  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-preview').classList.add('active');
  document.title = 'GITHYRULE · Dashboard';

  // Stocker le mot de passe pour le timer
  window._playerPassword = pass;

  setTimeout(triggerGlitch, 3000);
}

function triggerGlitch() {
  const overlay = document.getElementById('glitch-overlay');
  overlay.classList.add('show');
  setTimeout(() => {
    overlay.classList.remove('show');
    document.getElementById('screen-preview').classList.remove('active');
    document.getElementById('screen-narration').classList.add('active');
    document.title = 'GITHYRULE · Alerte sécurité';
    startNarration();
  }, 1500);
}

/* ===================== NARRATION ===================== */
let currentSlide = 1;
const TOTAL_SLIDES = 4;
let narrationTimer = null;

function startNarration() { showSlide(1); scheduleNext(); }

function scheduleNext() {
  if (currentSlide < TOTAL_SLIDES) {
    narrationTimer = setTimeout(() => {
      currentSlide++;
      showSlide(currentSlide);
      if (currentSlide < TOTAL_SLIDES) scheduleNext();
    }, 4000);
  }
}

function showSlide(n) {
  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const slide = document.getElementById('slide-' + i);
    const dot   = document.getElementById('dot-'   + i);
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

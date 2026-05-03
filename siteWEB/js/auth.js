/* ===================== AUTH ===================== */
function doLogin() {
  const user = document.getElementById('input-user').value.trim();
  const pass = document.getElementById('input-pass').value;
  if (user === '') { alert('Veuillez entrer votre identifiant.'); return; }

  // Stocker le mot de passe pour le timer (caché du joueur)
  window._playerPassword = pass;

  // Masquer le login, afficher le preview du dépôt
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-preview').classList.add('active');
  document.title = 'GITHYRULE · ' + user;

  // Après 3s sur le preview → glitch
  setTimeout(triggerGlitch, 3000);
}

/* ── Glitch overlay → narration ── */
function triggerGlitch() {
  document.getElementById('screen-preview').classList.remove('active');
  const overlay = document.getElementById('glitch-overlay');
  overlay.classList.add('show');
  setTimeout(function () {
    overlay.classList.remove('show');
    document.getElementById('screen-narration').classList.add('active');
    document.title = 'GITHYRULE · Alerte sécurité';
    startNarration();           // défini dans game.js
    window.playMusic();         // musique démarre ICI, pas avant
  }, 1500);
}
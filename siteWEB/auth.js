/**
 * AUTH.JS — Gestion des accès et détection d'erreurs
 */

function doLogin() {
  const user = document.getElementById('input-user').value.trim();
  // On accepte n'importe quel utilisateur non vide
  if (user === "") {
    alert("Please enter your username.");
    return;
  }

  // 1. Désactiver l'écran de Login
  document.getElementById('screen-login').classList.remove('active');
  
  // 2. Afficher le Dashboard GITHYRULE (la copie de GitHub)
  const preview = document.getElementById('screen-preview');
  preview.classList.add('active');
  document.title = "GITHYRULE · Home";

  // 3. Après 3 secondes, l'erreur système se déclenche
  setTimeout(() => {
    triggerSystemFailure();
  }, 3000);
}

/**
 * Déclenche l'effet de glitch et passe à l'interface de jeu
 */
function triggerSystemFailure() {
  const overlay = document.getElementById('glitch-overlay');
  overlay.classList.add('show');

  // Son d'erreur optionnel ici

  setTimeout(() => {
    overlay.classList.remove('show');
    
    // Basculer vers l'interface de jeucompromise
    document.getElementById('screen-preview').classList.remove('active');
    document.getElementById('screen-game').classList.add('active');
    document.title = "GITHYRULE · System Compromised";
    
    // Initialiser la logique du jeu
    initGame();
  }, 1500); // Durée du glitch
}
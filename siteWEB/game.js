/**
 * GAME.JS — Gestion du système compromis GITHYRULE
 */

// Timer : 5 minutes (300 secondes)
let timeLeft = 300; 
let countdownInterval = null;

/**
 * Initialise le jeu, le timer et les logs de départ
 */
function initGame() {
  addLog("Core system integrity compromised.");
  addLog("Navigation module data corrupted.");
  addLog("CRITICAL: Access 'livre.html' to extract navigation keys.");
  
  const timerDisplay = document.getElementById('gh-timer');
  
  countdownInterval = setInterval(() => {
    timeLeft--;
    
    // Calcul minutes/secondes
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    
    // Affichage formaté 00:00
    timerDisplay.textContent = `CRITICAL: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

    // Condition de défaite
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      systemLockdown();
    }
  }, 1000);
}

/**
 * Ajoute un log technique formaté dans la console
 */
function addLog(text) {
  const logBox = document.getElementById('logs');
  const entry = document.createElement('div');
  // Date style technique pour GitHub code block
  const now = new Date();
  const timeStr = now.toISOString().substring(11, 19); 
  
  entry.textContent = `[${timeStr}] [SYS_ERR] > ${text}`;
  logBox.appendChild(entry);
  
  // Scroll automatique vers le bas
  logBox.scrollTop = logBox.scrollHeight;
}

/**
 * Gère l'interaction avec les fichiers
 */
function openModule(fileName) {
  if (fileName === 'livre') {
    addLog("Analyzing 'livre.html' integrity...");
    addLog("Corruption detected. Redirection to sandbox environment.");
    
    // Ouvre livre.html dans un nouvel onglet
    window.open('livre.html', '_blank');
  } else {
    // Fichiers verrouillés
    addLog(`Access denied: '${fileName}' is locked by core process.`, "err");
  }
}

/**
 * Gère la défaite (temps écoulé)
 */
function systemLockdown() {
  addLog("FATAL ERROR: System lockdown initiated.");
  alert("System failure. Access revoked.");
  location.reload(); // Redémarre le jeu
}

/**
 * Fonction à appeler pour déclencher la victoire (depuis livre.html par exemple)
 */
function triggerWin() {
  clearInterval(countdownInterval);
  // Cacher tous les écrans
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Afficher l'écran victoire
  document.getElementById('screen-victory').classList.add('active');
  document.title = "GITHYRULE · Access Restored";
}
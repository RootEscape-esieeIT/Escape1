// Navigation
const pages = {
    home: document.getElementById('home-page'),
    auth: document.getElementById('auth-page'),
    counter: document.getElementById('counter-page')
};

function showPage(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');
}

// Accueil -> Auth
document.addEventListener('keydown', (e) => {
    if (pages.home.classList.contains('active') && e.code === 'Space') {
        showPage('auth');
    }
});

// Logique du Minuteur de Survie
let timerInterval = null;
let initialTime = 0;
let currentTime = 0;

const authForm = document.getElementById('auth-form');
const timerDisplay = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const terminalLog = document.getElementById('terminal-log');

// Algorithme de calcul du temps de crack (simulé)
function calculateSurvivalTime(password) {
    if (!password) return 0;
    
    if (/^\d+$/.test(password)) {
        return password.length <= 4 ? 20 : 60;
    }
    
    // Mot de passe complexe : 15s par caractère, max 10 min
    return Math.min(password.length * 15, 600);
}

function startHackerSession(password) {
    clearInterval(timerInterval);
    initialTime = calculateSurvivalTime(password);
    currentTime = initialTime;

    updateDisplay();

    timerInterval = setInterval(() => {
        currentTime--;
        updateDisplay();

        if (currentTime <= 0) {
            clearInterval(timerInterval);
            handleSystemCrash(currentPassword);
        }
    }, 1000);
}

function updateDisplay() {
    const mins = Math.floor(currentTime / 60);
    const secs = currentTime % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const percent = (currentTime / initialTime) * 100;
    progressBar.style.width = `${percent}%`;

    if (percent < 25) {
        progressBar.style.backgroundColor = "#ff3e3e";
        terminalLog.innerText = "> ERREUR CRITIQUE : Brute-force imminent...";
    } else {
        terminalLog.innerText = `> Proxy local actif. Paquets interceptés : ${Math.floor(Math.random() * 500)}`;
    }
}


async function handleSystemCrash(password) {
    const container = document.body;
    container.innerHTML = `<div class="crash-screen" id="terminal-final"></div>`;
    const term = document.getElementById('terminal-final');

    const write = (text, delay = 50) => {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                term.innerHTML += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    term.innerHTML += '\n';
                    resolve();
                }
            }, delay);
        });
    };

    await write("> BRUTE FORCE ATTACK COMPLETED...", 30);
    await write("> BYPASSING FIREWALL... [OK]", 30);
    await write("> ACCESSING ENCRYPTED SECTOR...", 30);
    await write("> PASSWORD CRACKED SUCCESSFULLY!", 20);

    const skull = `
      XXXXX      XXXXX
    XXXXXXXXX  XXXXXXXXX
   XXXXXXXXXXXXXXXXXXXXXX
   XXXXXXXXXXXXXXXXXXXXXX
    XXXXXXXXXXXXXXXXXXXX
      XXXXXXXXXXXXXXXX
        XXXXXXXXXXXX
          XXXXXXXX
            XXXX
    `;
    term.innerHTML += `<pre style="color: #ff3e3e">${skull}</pre>`;

    await new Promise(r => setTimeout(r, 500));
    const frame = `
    +---------------------------+
    | >>>  ${password.toUpperCase()}  |
    +---------------------------+
    `;
    term.innerHTML += `<div class="ascii-frame">${frame}</div>\n`;

    await new Promise(r => setTimeout(r, 800));
    const wolf = `
             .       .
            / \\     / \\
           /   \\___/   \\
          /             \\
         /  ( )     ( )  \\
         \\      ---      /
          \\    /   \\    /
           \\  /     \\  /
            \\/       \\/
    `;
    
    const wolfContainer = document.createElement('pre');
    wolfContainer.className = 'wolf-logo blink';
    wolfContainer.innerHTML = wolf;
    term.appendChild(wolfContainer);

    await write("\n> SYSTEM OWNED BY WOLF_HACKER", 50);
    
    setTimeout(() => {
        term.innerHTML += `<button onclick="location.reload()" style="background:none; border:1px solid #0f0; color:#0f0; cursor:pointer; margin-top:20px;">REBOOT SYSTEM</button>`;
    }, 3000);
}

// Formulaire
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user && pass) {
        document.getElementById('user-welcome').innerText = `AGENT : ${user.toUpperCase()}`;
        showPage('counter');
        startHackerSession(pass);
        authForm.reset();
    }
});

// Déconnexion
document.getElementById('btn-logout').addEventListener('click', () => {
    clearInterval(timerInterval);
    showPage('home');
});
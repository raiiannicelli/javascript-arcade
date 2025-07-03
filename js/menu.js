// menu.js
// Gerencia o menu e a troca entre jogos

const menu = document.getElementById('menu');
const canvas = document.getElementById('game-canvas');
const backMenuBtn = document.getElementById('back-menu');
let reloadBtn = null;
const playSnakeBtn = document.getElementById('play-snake');
const playPongBtn = document.getElementById('play-pong');


let currentGame = null;
let currentGameName = null;

function showMenu() {
    menu.style.display = 'flex';
    canvas.style.display = 'none';
    backMenuBtn.style.display = 'none';
    if (reloadBtn) reloadBtn.style.display = 'none';
    if (currentGame && currentGame.stop) currentGame.stop();
    currentGame = null;
    currentGameName = null;
}

function startGame(gameName) {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    backMenuBtn.style.display = 'inline-block';
    if (!reloadBtn) {
        reloadBtn = document.createElement('button');
        reloadBtn.id = 'reload-game';
        reloadBtn.title = 'Recarregar';
        reloadBtn.style.marginLeft = '1rem';
        reloadBtn.style.verticalAlign = 'middle';
        reloadBtn.innerHTML = '<img src="assets/reload.svg" alt="Recarregar" style="width:24px;vertical-align:middle;">';
        backMenuBtn.parentNode.insertBefore(reloadBtn, backMenuBtn.nextSibling);
    }
    reloadBtn.style.display = 'inline-block';
    reloadBtn.onclick = () => {
        if (currentGame && currentGame.stop) currentGame.stop();
        startGame(currentGameName);
    };
    currentGameName = gameName;
    if (currentGame && currentGame.stop) currentGame.stop();
    if (gameName === 'snake') {
        import('./snake.js').then(mod => {
            currentGame = new mod.SnakeGame(canvas);
            currentGame.start();
        });
    } else if (gameName === 'pong') {
        import('./pong.js').then(mod => {
            currentGame = new mod.PongGame(canvas);
            currentGame.start();
        });
    }
}


playSnakeBtn.innerHTML = '<img src="assets/snake.svg" alt="Snake" style="width:24px;vertical-align:middle;margin-right:8px;">Jogar Snake';
playPongBtn.innerHTML = '<img src="assets/pong.svg" alt="Pong" style="width:24px;vertical-align:middle;margin-right:8px;">Jogar Pong';

playSnakeBtn.onclick = () => startGame('snake');
playPongBtn.onclick = () => startGame('pong');
backMenuBtn.onclick = showMenu;

// Exibe o menu ao carregar
showMenu();

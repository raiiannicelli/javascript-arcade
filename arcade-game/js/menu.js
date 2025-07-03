// menu.js
// Gerencia o menu e a troca entre jogos

const menu = document.getElementById('menu');
const canvas = document.getElementById('game-canvas');
const backMenuBtn = document.getElementById('back-menu');
const playSnakeBtn = document.getElementById('play-snake');
const playPongBtn = document.getElementById('play-pong');

let currentGame = null;

function showMenu() {
    menu.style.display = 'flex';
    canvas.style.display = 'none';
    backMenuBtn.style.display = 'none';
    if (currentGame && currentGame.stop) currentGame.stop();
    currentGame = null;
}

function startGame(gameName) {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    backMenuBtn.style.display = 'inline-block';
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

playSnakeBtn.onclick = () => startGame('snake');
playPongBtn.onclick = () => startGame('pong');
backMenuBtn.onclick = showMenu;

// Exibe o menu ao carregar
showMenu();

// pong.js
// Jogo Pong clássico

export class PongGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.running = false;
        this.keyListener = this.handleKey.bind(this);
        this.reset();
    }

    reset() {
        this.paddleHeight = 60;
        this.paddleWidth = 10;
        this.ballSize = 10;
        this.playerY = this.canvas.height / 2 - this.paddleHeight / 2;
        this.aiY = this.canvas.height / 2 - this.paddleHeight / 2;
        this.ball = { x: this.canvas.width / 2, y: this.canvas.height / 2, vx: 4, vy: 2 };
        this.score = { player: 0, ai: 0 };
        this.up = false;
        this.down = false;
        this.gameOver = false;
    }

    start() {
        this.reset();
        this.running = true;
        document.addEventListener('keydown', this.keyListener);
        document.addEventListener('keyup', this.keyListener);
        this.loop();
    }

    stop() {
        this.running = false;
        document.removeEventListener('keydown', this.keyListener);
        document.removeEventListener('keyup', this.keyListener);
    }

    handleKey(e) {
        if (e.type === 'keydown') {
            if (e.key === 'ArrowUp') this.up = true;
            if (e.key === 'ArrowDown') this.down = true;
        } else if (e.type === 'keyup') {
            if (e.key === 'ArrowUp') this.up = false;
            if (e.key === 'ArrowDown') this.down = false;
        }
    }

    loop() {
        if (!this.running) return;
        requestAnimationFrame(() => {
            this.update();
            this.draw();
            if (!this.gameOver) this.loop();
        });
    }

    update() {
        // Player
        if (this.up) this.playerY -= 5;
        if (this.down) this.playerY += 5;
        this.playerY = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.playerY));
        // AI
        if (this.ball.y < this.aiY + this.paddleHeight / 2) this.aiY -= 3;
        else if (this.ball.y > this.aiY + this.paddleHeight / 2) this.aiY += 3;
        this.aiY = Math.max(0, Math.min(this.canvas.height - this.paddleHeight, this.aiY));
        // Ball
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        // Colisão com topo/baixo
        if (this.ball.y < 0 || this.ball.y > this.canvas.height - this.ballSize) this.ball.vy *= -1;
        // Colisão com jogador
        if (this.ball.x < this.paddleWidth && this.ball.y + this.ballSize > this.playerY && this.ball.y < this.playerY + this.paddleHeight) {
            this.ball.vx *= -1;
            this.ball.x = this.paddleWidth;
        }
        // Colisão com AI
        if (this.ball.x > this.canvas.width - this.paddleWidth - this.ballSize && this.ball.y + this.ballSize > this.aiY && this.ball.y < this.aiY + this.paddleHeight) {
            this.ball.vx *= -1;
            this.ball.x = this.canvas.width - this.paddleWidth - this.ballSize;
        }
        // Pontuação
        if (this.ball.x < 0) {
            this.score.ai++;
            this.resetBall();
        }
        if (this.ball.x > this.canvas.width - this.ballSize) {
            this.score.player++;
            this.resetBall();
        }
        // Fim de jogo
        if (this.score.player >= 5 || this.score.ai >= 5) {
            this.gameOver = true;
        }
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.vx = (Math.random() > 0.5 ? 4 : -4);
        this.ball.vy = (Math.random() > 0.5 ? 2 : -2);
    }

    draw() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Player
        this.ctx.fillStyle = '#00c853';
        this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);
        // AI
        this.ctx.fillStyle = '#ff1744';
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.aiY, this.paddleWidth, this.paddleHeight);
        // Ball
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.ball.x, this.ball.y, this.ballSize, this.ballSize);
        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Você: ' + this.score.player, 40, 24);
        this.ctx.fillText('AI: ' + this.score.ai, this.canvas.width - 100, 24);
        // Game Over
        if (this.gameOver) {
            this.ctx.fillStyle = '#ffeb3b';
            this.ctx.font = '32px Arial';
            let msg = this.score.player > this.score.ai ? 'Você venceu!' : 'AI venceu!';
            this.ctx.fillText('Fim de Jogo', this.canvas.width/2 - 80, this.canvas.height/2 - 20);
            this.ctx.fillText(msg, this.canvas.width/2 - 80, this.canvas.height/2 + 20);
        }
    }
}

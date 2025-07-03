// snake.js
// Jogo Snake clássico

export class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.size = 20;
        this.reset();
        this.running = false;
        this.keyListener = this.handleKey.bind(this);
    }

    reset() {
        this.snake = [{x: 8, y: 8}];
        this.dir = {x: 1, y: 0};
        this.nextDir = {x: 1, y: 0};
        this.food = this.randomPos();
        this.score = 0;
        this.gameOver = false;
    }

    randomPos() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.size)),
            y: Math.floor(Math.random() * (this.canvas.height / this.size))
        };
    }

    start() {
        this.reset();
        this.running = true;
        document.addEventListener('keydown', this.keyListener);
        this.loop();
    }

    stop() {
        this.running = false;
        document.removeEventListener('keydown', this.keyListener);
    }

    handleKey(e) {
        const {x, y} = this.dir;
        if (e.key === 'ArrowUp' && y !== 1) this.nextDir = {x: 0, y: -1};
        else if (e.key === 'ArrowDown' && y !== -1) this.nextDir = {x: 0, y: 1};
        else if (e.key === 'ArrowLeft' && x !== 1) this.nextDir = {x: -1, y: 0};
        else if (e.key === 'ArrowRight' && x !== -1) this.nextDir = {x: 1, y: 0};
    }

    loop() {
        if (!this.running) return;
        setTimeout(() => {
            this.update();
            this.draw();
            if (!this.gameOver) this.loop();
        }, 100);
    }

    update() {
        this.dir = this.nextDir;
        const head = {
            x: this.snake[0].x + this.dir.x,
            y: this.snake[0].y + this.dir.y
        };
        // Colisão com parede
        if (head.x < 0 || head.y < 0 || head.x >= this.canvas.width / this.size || head.y >= this.canvas.height / this.size) {
            this.gameOver = true;
            return;
        }
        // Colisão com o próprio corpo
        if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            this.gameOver = true;
            return;
        }
        this.snake.unshift(head);
        // Comer comida
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.food = this.randomPos();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Snake
        this.ctx.fillStyle = '#00c853';
        for (const seg of this.snake) {
            this.ctx.fillRect(seg.x * this.size, seg.y * this.size, this.size - 2, this.size - 2);
        }
        // Food
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.fillRect(this.food.x * this.size, this.food.y * this.size, this.size - 2, this.size - 2);
        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Score: ' + this.score, 10, 24);
        // Game Over
        if (this.gameOver) {
            this.ctx.fillStyle = '#ff1744';
            this.ctx.font = '32px Arial';
            this.ctx.fillText('Game Over', this.canvas.width/2 - 80, this.canvas.height/2);
        }
    }
}

const sky = document.querySelector('.sky');
const pipe = document.querySelector('.pipe');
const startButton = document.querySelector('.start-game');
const startScreen = document.querySelector('.start');
const coin = document.querySelector('.coin');
const restartButton = document.getElementById('restart');
const fundo = document.querySelector('.background-panoramico');
const musicGame = new Audio('songs/sky-background-music.mp3');
const gameOverInfo = document.querySelector('.game-over-info');

musicGame.loop = true;
musicGame.volume = 0.3;

let gameStarted = false;
let coinCollected = false;
let score = 0;

const scoreDisplay = document.querySelector('.score');
const recordDisplay = document.querySelector('.record');

let highScore = localStorage.getItem('highScore') || 0;
recordDisplay.textContent = `Recorde: ${highScore}`;

// 🚀 NOVO SISTEMA DE MOVIMENTO DO PIPE
let pipeSpeed = 5;
let pipeX = window.innerWidth;

const jump = (event) => {
    event?.preventDefault();

    if (!gameStarted) return;
    if (document.body.classList.contains('game-over')) return;
    if (sky.classList.contains('jump')) return;

    sky.classList.add('jump');
};

startButton.addEventListener('click', () => {
    musicGame.play();

    if (fundo) fundo.style.animationPlayState = 'running';

    gameStarted = true;
    startScreen.style.display = 'none'; 

    pipe.style.display = 'block'; 

    coin.style.opacity = '1';
    coin.style.animationPlayState = 'running';

    sky.classList.remove('sky-idle');
    sky.classList.add('sky-run');
});

const loop = () => {
    if (!gameStarted) {
        requestAnimationFrame(loop);
        return;
    }

    pipeX -= pipeSpeed;

    if (pipeX < -300) {
        pipeX = window.innerWidth;

    
        scoreDisplay.textContent = score;

        if (score % 5 === 0 && pipeSpeed < 12) {
            pipeSpeed += 0.5;
        }
    }

    pipe.style.left = pipeX + "px";

    const coinPosition = coin.offsetLeft;
    const coinWidth = coin.clientWidth;
    const skyPosition = +window.getComputedStyle(sky).bottom.replace('px', '');

    const skyLeft = sky.offsetLeft;
    const skyWidth = sky.clientWidth;
    const skyRight = skyLeft + skyWidth;

    const coinStart = coinPosition;
    const coinEnd = coinStart + coinWidth;

    const coinCollisionHorizontal = skyRight >= coinStart && skyLeft <= coinEnd;
    const coinCollisionVertical = skyPosition >= 120;

    if (coinCollisionHorizontal && coinCollisionVertical && !coinCollected) {
        coinCollected = true;
        coin.style.opacity = '0';

        score++;
        scoreDisplay.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            recordDisplay.textContent = `Recorde: ${highScore}`;
        }
    }

    const pipeWidth = pipe.clientWidth;
    const alturaDoCogumelo = 45;

    const inicioDoDesenhoVermelho = pipe.offsetLeft + (pipeWidth * 0.42);
    const fimDoDesenhoVermelho = pipe.offsetLeft + (pipeWidth * 0.58);

    const colidiuLateral = skyRight >= inicioDoDesenhoVermelho && skyLeft <= fimDoDesenhoVermelho;
    const colidiuVertical = skyPosition < alturaDoCogumelo;

    if (colidiuLateral && colidiuVertical) {
        pipe.style.left = `${pipeX}px`;
        sky.style.bottom = `${skyPosition}px`;

        gameOverInfo.textContent = `Pontos: ${score} | Recorde: ${highScore}`;
        gameOverInfo.style.display = 'block';

        if (fundo) fundo.style.animationPlayState = 'paused';

        document.body.classList.add('game-over');
        sky.classList.add('sky-dead');

        coin.style.opacity = '0';

        if (restartButton) {
            restartButton.style.setProperty('display', 'block', 'important');
            musicGame.pause();
            musicGame.currentTime = 0;
        }

        return;
    }

    requestAnimationFrame(loop);
};

coin.addEventListener('animationiteration', (event) => {
    if (event.animationName === 'coin-move') {
        if (document.body.classList.contains('game-over')) return;

        coinCollected = false;
        coin.style.opacity = '1';
    }
});

if (restartButton) {
    restartButton.addEventListener('click', () => {
        window.location.reload();
    });
}

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump, { passive: false });

sky.addEventListener('animationend', () => {
    sky.classList.remove('jump');
});

loop();
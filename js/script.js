const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const cloud = document.querySelector('.clouds');
const startButton = document.querySelector('.start-game');
const startScreen = document.querySelector('.start');
const coin = document.querySelector('.coin');
const scoreDisplay = document.querySelector('.score');
const restartButton = document.getElementById('restart');

let gameStarted = false;
let coinCollected = false;
let score = 0;
let hasScored = false;

const jump = (event) => {
    event?.preventDefault();

    if (!gameStarted) return;
    if (document.body.classList.contains('game-over')) return;
    if (mario.classList.contains('jump')) return;

    mario.classList.add('jump');
};

startButton.addEventListener('click', () => {
    gameStarted = true;
    startScreen.style.display = 'none';

    pipe.style.animationPlayState = 'running';
    cloud.style.animationPlayState = 'running';
    
    coin.style.opacity = '1';
    coin.style.animationPlayState = 'running';

    mario.classList.remove('mario-idle');
    mario.classList.add('mario-run');
});


const loop = () => {
    if (!gameStarted) {
        requestAnimationFrame(loop);
        return;
    }

    const pipePosition = pipe.offsetLeft;
    const coinPosition = coin.offsetLeft;
    const coinWidth = coin.clientWidth;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    
    const marioLeft = mario.offsetLeft;
    const marioWidth = mario.clientWidth;
    const marioRight = marioLeft + marioWidth; 

    const coinStart = coinPosition;
    const coinEnd = coinStart + coinWidth;

    const coinCollisionHorizontal = marioRight >= coinStart && marioLeft <= coinEnd;
    const coinCollisionVertical = marioPosition >= 120;

    if (coinCollisionHorizontal && coinCollisionVertical && !coinCollected) {
        coinCollected = true;
        coin.style.opacity = '0'; 
        score++;
        scoreDisplay.textContent = score;
    }

    const pipeWidth = pipe.clientWidth;
    const alturaDoCogumelo = 45; 
    const inicioDoDesenhoVermelho = pipePosition + (pipeWidth * 0.42); 
    const fimDoDesenhoVermelho = pipePosition + (pipeWidth * 0.58);    
    const colidiuLateral = marioRight >= inicioDoDesenhoVermelho && marioLeft <= fimDoDesenhoVermelho;
    const colidiuVertical = marioPosition < alturaDoCogumelo;

    if (colidiuLateral && colidiuVertical) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        const cloudPosition = cloud.offsetLeft;
        cloud.style.animation = 'none';
        cloud.style.left = `${cloudPosition}px`;

        document.body.classList.add('game-over');
        mario.classList.add('mario-dead');

        coin.style.animationPlayState = 'paused';
        coin.style.opacity = '0';

        if (restartButton) {
            restartButton.style.setProperty('display', 'block', 'important');
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

mario.addEventListener('animationend', () => {
    mario.classList.remove('jump');
});

loop();
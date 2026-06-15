const sky = document.querySelector('.sky');
const pipe = document.querySelector('.pipe');
const startButton = document.querySelector('.start-game');
const startScreen = document.querySelector('.start');
const coin = document.querySelector('.coin');
const scoreDisplay = document.querySelector('.score');
const restartButton = document.getElementById('restart');
const fundo = document.querySelector('.background-panoramico'); // Seleciona o fundo panorâmico

let gameStarted = false;
let coinCollected = false;
let score = 0;
let hasScored = false;

const jump = (event) => {
    event?.preventDefault();

    if (!gameStarted) return;
    if (document.body.classList.contains('game-over')) return;
    if (sky.classList.contains('jump')) return;

    sky.classList.add('jump');
};

startButton.addEventListener('click', () => {
    if (fundo) fundo.style.animationPlayState = 'running'; // Inicia o fundo se ele existir

    gameStarted = true;
    startScreen.style.display = 'none';

    pipe.style.animationPlayState = 'running';
    
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

    const pipePosition = pipe.offsetLeft;
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
    }

    const pipeWidth = pipe.clientWidth;
    const alturaDoCogumelo = 45; 
    const inicioDoDesenhoVermelho = pipePosition + (pipeWidth * 0.42); 
    const fimDoDesenhoVermelho = pipePosition + (pipeWidth * 0.58);    
    const colidiuLateral = skyRight >= inicioDoDesenhoVermelho && skyLeft <= fimDoDesenhoVermelho;
    const colidiuVertical = skyPosition < alturaDoCogumelo;

    if (colidiuLateral && colidiuVertical) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        sky.style.animation = 'none';
        sky.style.bottom = `${skyPosition}px`;

       
        if (fundo) fundo.style.animationPlayState = 'paused';

        document.body.classList.add('game-over');
        sky.classList.add('sky-dead');

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

sky.addEventListener('animationend', () => {
    sky.classList.remove('jump');
});

loop();
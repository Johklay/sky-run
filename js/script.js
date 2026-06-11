const mario = document.querySelector('.mario')
const pipe = document.querySelector('.pipe')
const cloud = document.querySelector('.clouds')
const startButton = document.querySelector('.start-game')
const startScreen = document.querySelector('.start')
let gameStarted = false;

const jump  = (event) => {
    event?.preventDefault();

    if(!gameStarted) return;

    if (document.body.classList.contains('game-over')) return;
    if (mario.classList.contains('jump')) return;

    mario.classList.add('jump')

}

startButton.addEventListener('click', () =>{
    gameStarted = true;
    startScreen.style.display = 'none';
    pipe.style.animationPlayState = 'running';
    cloud.style.animationPlayState  = 'running';

    mario.classList.remove('mario-idle');
    mario.classList.add('mario-run')
})

/*const restartButton = document.getElementById('restart')
restartButton.style.display = 'block'

restartButton.addEventListener('click', () =>{
    score = 0;
    scoreDisplay.textContent = score;
    hasScored = false;
});*/


let score = 0;
const scoreDisplay = document.querySelector('.score')
let hasScored = false;

const loop = () =>{

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const marioHeight = mario.clientHeight;

     if(pipePosition < 0 && !hasScored) {
        score++;
        scoreDisplay.textContent = score;
        hasScored = true;
    }

    if(pipePosition > window.innerWidth){
        hasScored = false;
    }

    const isPortrait = window.innerHeight > window.innerWidth;
    const limiteColisao = isPortrait ? 80 : 100;
    
    if (pipePosition <= limiteColisao && pipePosition > 0 && marioPosition < mario.clientHeight * 0.6){

        pipe.style.animation = 'none'
        pipe.style.left = `${pipePosition}px`

        mario.style.animation = 'none'
        mario.style.bottom = `${marioPosition}px`

        const cloudPosition = cloud.offsetLeft;
        cloud.style.animation = 'none';
        cloud.style.left = `${cloudPosition}px`;

        document.body.classList.add('game-over')

        mario.classList.add('mario-dead')

        const restartButton = document.getElementById('restart');
        if (restartButton){
            restartButton.style.setProperty('display', 'block', 'important');
        }
        return;
    }

    requestAnimationFrame(loop)
};

const restartButton = document.getElementById('restart');

if (restartButton) {
    restartButton.addEventListener('click', () => {
        window.location.reload();
    })
}

document.addEventListener('keydown', jump)
document.addEventListener('touchstart', jump, {passive: false})

mario.addEventListener('animationend', () => {
    mario.classList.remove('jump');
});

loop();

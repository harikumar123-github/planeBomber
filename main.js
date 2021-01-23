const msg = document.querySelector('.message');
const userPlay = document.querySelector('.userPlay')
const score = document.querySelector('.score')
const gameArea = document.querySelector('.gameArea')
const res = document.querySelector('.res');

let keys = {

};

let player = {
    speed: 2,
    score: 0,
    inplay: false,
    activeBomb: 0,
    ready: true,
    bombNum: 0,
    level: 10
};

 
document.addEventListener( 'keydown',pressOn);
document.addEventListener( 'keyup',pressOff);

msg.addEventListener('click',start);


function pressOn(e){
    e.preventDefault();
    if(e.key === ' ')  keys['space'] = true;
    else  keys[e.key] = true;
}

function pressOff(e){
    e.preventDefault();
    if(e.key === ' ')  keys['space'] = false;
    else  keys[e.key] = false;
}

function makeEnemy() {
    player.level--;
    if(player.level < 0){
        endGame();
    }
    player.base = document.createElement('div');
    player.base.classList = 'base';
    player.base.style.width = (Math.floor(Math.random()*250) + 20 )+ 'px';
    player.base.style.height = (Math.floor(Math.random()*100) + 100 )+ 'px';
    player.base.style.left = (Math.floor(Math.random()*(gameArea.offsetWidth-400)) + 100 )+ 'px';
    gameArea.appendChild(player.base);
}

function makeBomb(){
    player.activeBomb++;
    player.bombNum++;
    let bomb = document.createElement('div');
    bomb.classList.add('bomb');
    bomb.innerHTML = player.bombNum;
    bomb.x =player.x;
    bomb.y = player.y;
    bomb.style.left = player.x + 'px';
    bomb.style.top = player.y + 'px';
    gameArea.appendChild(bomb);
    player.ready= false;
    setTimeout( () => {
        player.ready = true;
    },500 )
}

function endGame(){
    player.level = 10;
    gameArea.innerHTML="";
    msg.classList.remove('hide');
    score.classList.add('hide');
    msg.innerText = "Game Over. Score: " + player.score + ' ..Click to Start';
    player.score = 0;
    player.inplay = false;
} 
 
function start(){
    msg.classList.add('hide');
    score.classList.remove('hide');
    gameArea.innerHTML="";
    player.inplay = true;
    player.ready = true;
    player.totalBombs = 3;
    makeEnemy();
    player.plane = document.createElement('div');
    player.plane.classList = 'plane';
    gameArea.appendChild(player.plane);
    player.x = player.plane.offsetLeft;
    player.y = player.plane.offsetTop;


    window.requestAnimationFrame(playGame);
}

function isCollided(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    )
}

function moveBomb() {
    let bombs = document.querySelectorAll('.bomb');
    bombs.forEach(item => {
        item.y += 5;
        item.style.top = item.y + 'px';
        if(item.y > gameArea.offsetHeight){
            player.activeBomb--;
            item.parentElement.removeChild(item);
        }
        if(isCollided(item,player.base)){
            player.score+=2000;
            player.activeBomb--;
            player.base.parentElement.removeChild(player.base);
            item.parentElement.removeChild(item);
            makeEnemy();
        }
    });
}

function playGame(){
    if(player.inplay){
        moveBomb();
        if(keys['space'] && player.ready && player.activeBomb<player.totalBombs){
            makeBomb();
        }
 
        if((keys.ArrowUp) && player.y > 80 ){
            player.y -= player.speed;
        }
        if(keys.ArrowDown &&  player.y < gameArea.offsetHeight-600){  
            player.y += player.speed;
        }
        if(keys.ArrowLeft && player.x > 0){  
            player.x -= player.speed;
        }
        if(keys.ArrowRight && player.x < gameArea.offsetWidth-80){
            player.x += player.speed;
        }

        if(player.x < gameArea.offsetWidth-80)
            player.x += player.speed*2;

        if(player.x >= gameArea.offsetWidth-80){
            player.x = 0;
            player.score -= 100;
        }

        --player.score;

        player.plane.style.left = player.x + 'px';
        player.plane.style.top = player.y + 'px'; 

        player.score += 0.5;
        window.requestAnimationFrame(playGame);
        score.innerText = 'Score: ' + Math.floor(player.score);
    }
}

 

var mycanvas = document.getElementById("mycanvas");
var ctx = mycanvas.getContext("2d");
var bullets = [];
var enemies = [];
var gameover = false;
var die = [];
var restart = document.getElementById("restart");
var pauseGame = document.getElementById("pause");
var gamePaused = false;
var score = 0;
var scoredisplay = document.getElementById("scoredisplay");
var requestId;
var game;
var line = {
    xPos: 0,
    yPos: 500,
    height: 20,
    width: 400,
};

pauseGame.addEventListener("click", function() {
    if(gamePaused === true){
        gamePaused = false;
        requestId = window.requestAnimationFrame(gameLoop);
        pauseGame.value = "pause";
    } else {
        gamePaused = true;
        window.cancelAnimationFrame(requestId);
        pauseGame.value = "resume";
    }
});

var box = {
    xPos: 200,
    yPos: 400,
    height: 20,
    width: 20,
    goLeft: false,
    goRight: false,
    goUp: false,
    goDown: false,
    shooting: false,
    die: false,
    canshoot: true,
    
    move: function() {

        if (box.goLeft && box.xPos > 0) {
            box.xPos -= 7;
        }
        if (box.goRight && box.xPos < 380) {
            box.xPos += 7;
        }
        if (box.goUp && box.yPos > 400) {
            box.yPos -= 7;
        }
        if (box.goDown && box.yPos < 400) {
            box.yPos += 7;
        }

    },
    shoot: function() {
        if (box.shooting && box.canshoot) {
            bullets.push(new Bullet(box.xPos, box.yPos));
            setTimeout(function(){
                box.canshoot = true;
            }, 300);
            box.canshoot = false;
        }
    },
    draw: function() {
        ctx.rect(box.xPos, box.yPos, this.width, this.height);
        ctx.stroke();
    }
};

function Bullet(xPos, yPos ) {
    this.xPos = xPos + 9;
    this.yPos = yPos;
    this.height = 10;
    this.width = 2;
    this.draw = function() {
        ctx.rect(this.xPos, this.yPos, this.width, this.height);
        ctx.stroke();

    };
    this.move = function() {
        this.yPos -= 10;
        if(this.yPos < -5){
            this.toremove = true;
            }
        
        if(this.yPos < 0){
            return false;
            
        } else {
            
        
        return true;
        }
        
    };
    this.toremove=false;
}

function Enemy(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.height = 30;
    this.width = 30;
    this.draw = function() {
        ctx.rect(this.xPos, this.yPos, this.width, this.height);
        ctx.stroke();
    };
    this.move = function() {
        this.xPos -= 0;
        this.yPos -= -10;
        if(this.yPos > 500){
            this.toremove = true;
        }
    };
}

function pauseGame() {
    game = clearTimeout(game);
    pauseGame.addEventListener("click", pauseGame);
    if(!gamePaused){
        gamePaused = true;
    } else if (gamePaused){
        game = setTimeout(gameLoop, 500/30);
        gamePaused = false;
    }
}
    
    
    
document.addEventListener("keydown", function(evt) {
    if (evt.keyCode === 37) {
        box.goLeft = true;
    }
    if (evt.keyCode === 38) {
        box.goUp = true;
    }
    if (evt.keyCode === 39) {
        box.goRight = true;
    }
    if (evt.keyCode === 40) {
        box.goDown = true;
    }
    if (evt.keyCode === 32) {
        box.shooting = true;
    }
    if (evt.keycode === 80){
        
    }
        
    if (evt.keyCode === 82) {
        window.cancelAnimationFrame(requestId);
        score = 0;
        gameover = false;
        enemies = [];
        bullets = [];
        box.xPos = 200;
        box.yPos = 400;
        gameLoop();
    }
});

document.addEventListener("keyup", function(evt) {
    if (evt.keyCode === 37) {
        box.goLeft = false;
    }
    if (evt.keyCode === 38) {
        box.goUp = false;
    }
    if (evt.keyCode === 39) {
        box.goRight = false;
    }
    if (evt.keyCode === 40) {
        box.goDown = false;
    }
    if (evt.keyCode === 32) {
        box.shooting = false;
    }
    
    });

function gameLoop() {
    ctx.beginPath();
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
    box.move();
    box.draw();
    box.shoot();
    
    for (var j = 0; j < bullets.length; j++) {
        bullets[j].move();
        bullets[j].draw();
        for(var k = 0; k < enemies.length; k++){
            if(isColliding(bullets[j], enemies[k])){
                enemies[k].toremove=true;
                bullets[j].toremove=true;
                score = score + 100;
            } 
        }
        
    }
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();
        if(isColliding(box, enemies[i])){
            gameover = true;
            alert("Press R to Restart.");
        }
        if(isColliding(line, enemies[i])){
            gameover = true;
            alert("Press R to Restart.");
        }
    }
    
    for (var i = 0; i < die.length; i++) {
        
    }
    
    garbagecollector();
    scoredisplay.innerHTML = "score: " + score;
    if(gameover === false ){
    requestId = window.requestAnimationFrame(gameLoop);
    } else{
        window.cancelAnimationFrame(requestId);
        gameover;
    }
}

restart.addEventListener("click", function(){
    window.cancelAnimationFrame(requestId);
    score = 0;
    gameover = false;
    enemies = [];
    bullets = [];
    box.xPos = 200;
    box.yPos = 400;
    gameLoop();
});

function garbagecollector(){
    for (var j = 0; j < bullets.length; j++) {
            if(bullets[j].toremove === true){
                bullets.splice(j, 1);
            }
    }
    for (var k = 0; k < enemies.length; k++){
        if(enemies[k].toremove === true){
            enemies.splice(k, 1);
        }
    }
}


var wave1 = setInterval(function(){
    var tempRand = Math.random() * mycanvas.width;
    enemies.push(new Enemy(tempRand - 5, 0));
}, 1);


function isColliding(thing1, thing2){
    console.log(thing1, thing2);
    var isLeft = thing2.xPos + thing2.width < thing1.xPos;
    var isRight = thing2.xPos > thing1.xPos + thing1.width;
    var isBelow = thing2.yPos + thing2.height < thing1.yPos;
    var isAbove = thing2.yPos > thing1.yPos + thing1.height;
    return !(isRight||isLeft||isAbove||isBelow);
}

gameLoop();
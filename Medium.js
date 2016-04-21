var mycanvas = document.getElementById("mycanvas");
var ctx = mycanvas.getContext("2d");
var bullets = [];
var enemies = [];
var die = [];
var line = {
    xPos: 0,
    yPos: 500,
    height: 20,
    width: 400,
};
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
        this.yPos -= -1;
    };
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
                enemies.splice(k, 1);
                bullets[j].toremove=true;
            } 
        }
        
    }
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();
        if(isColliding(box, enemies[i])){
            box.splice(i, 1);
        }
        if(isColliding(line, enemies[i])){
            box.splice(i, 1);
        }
    }
    
    for (var i = 0; i < die.length; i++) {
        
    }
    
    garbagecollector();
    window.requestAnimationFrame(gameLoop);
}


function garbagecollector(){
    for (var j = 0; j < bullets.length; j++) {
            if(bullets[j].toremove === true){
                bullets.splice(j, 1);
            }
    }
}


var wave1 = setInterval(function(){
    var tempRand = Math.random() * mycanvas.width;
    enemies.push(new Enemy(tempRand - 2, 0));
}, 
1);


function isColliding(thing1, thing2){
    console.log(thing1, thing2);
    var isLeft = thing2.xPos + thing2.width < thing1.xPos;
    var isRight = thing2.xPos > thing1.xPos + thing1.width;
    var isBelow = thing2.yPos + thing2.height < thing1.yPos;
    var isAbove = thing2.yPos > thing1.yPos + thing1.height;
    return !(isRight||isLeft||isAbove||isBelow);
}

gameLoop();
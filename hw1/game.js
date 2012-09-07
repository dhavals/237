var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var intervalId;
var timerDelay = 10;

// this is an array to ensure we can read multiple key presses at the same time!
var keysPressed = new Object(); 


function BallBounds(edgeUp, edgeDown, edgeLeft, edgeRight)
{
    this.edgeUp = edgeUp;
    this.edgeDown = edgeDown;
    this.edgeLeft = edgeLeft;
     this.edgeRight = edgeRight;
}

// super class for drawing round movable objects on the canvas
function MovingCircle(cx, cy, xSpeed, ySpeed, radius)
{
    this.cx = cx;
    this.cy = cy;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.radius = radius;   
}

// subclass of movingcircle
function Ball(cx, cy, xSpeed, ySpeed, radius, color)
{
    MovingCircle.call(this, cx, cy, xSpeed, ySpeed, radius);
    this.color = color;
}
Ball.prototype = new MovingCircle();
Ball.prototype.constructor = Ball;


// subclass of movingcircle
function PowerUp(cx, cy, xSpeed, ySpeed, radius, color, power, freqsecs)
{
    MovingCircle.call(this, cx, cy, xSpeed, ySpeed, radius);
    this.color = color;    
    this.power = power;
    this.frequency = freqsecs; // in seconds
}
PowerUp.prototype = new MovingCircle();
PowerUp.prototype.constructor = PowerUp;
PowerUp.prototype.power = 'biggerpaddle';
PowerUp.prototype.isActive = false;
PowerUp.prototype.duration = 10*1000;


function Paddle(cx, cy, width, height, radius, name)
{
    this.cx = cx;
    this.cy = cy;
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.radius = radius;
    this.name = name;
}

function Player()
{
    this.score = 0;
    this.control = "keyboard";
}

function DisplayPage(level)
{
    this.level = level;
}

var initBallX = 200;
var initBallY = 200;
var initBallXSpeed = 4;
var initBallYSpeed = 4;
var initBallRadius = 7;

var initPaddleWidth = 10;
var initPaddleHeight = 60;
var initPaddleRadius = 5;

var initPaddle1X = 25;
var initPaddle1Y = (canvasHeight/2) - 50;
var initPaddle2X = canvasWidth - 30 - 5;
var initPaddle2Y = (canvasHeight/2) - 50;



var ball = new Ball(initBallX, initBallY, initBallXSpeed, initBallYSpeed, initBallRadius, 'yellow');
var ballHome1 = new Ball(250, 200, 3, 4, 7, 'yellow');
var ballHome2 = new Ball(350, 250, -3, 5, 7, 'yellow');
var ballHome3 = new Ball(10, 50, 3, -4, 7, 'yellow');

var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);

var paddle1 = new Paddle(initPaddle1X, initPaddle1Y, initPaddleWidth, initPaddleHeight, initPaddleRadius, "one");
var paddle2 = new Paddle(initPaddle2X, initPaddle2Y, initPaddleWidth, initPaddleHeight, initPaddleRadius, "two");

var player1 = new Player();
var player2 = new Player();

var page = new DisplayPage("home");
var settingState = "none";

var maxSpeed = 10;
var minSpeed = 3;

var maxScore = 15;

var powerUpBigPaddle = new PowerUp(canvasWidth/2, canvasHeight/2, 4, 4, 10, 'orange', 'biggerpaddle', 20); // every 10 secs

function redrawHome()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); 

    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("PONG", canvasWidth/2 , canvasHeight/4);

    ctx.font = "25px Arial";
    ctx.fillText("Play (P to Play)", canvasWidth/2, canvasHeight/2);
    ctx.fillText("Instructions (I for Instructions)", canvasWidth/2, canvasHeight/2 + 60);
}

function redrawSettings()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Settings", canvasWidth/2, canvasHeight/8);

    ctx.font = "20px Arial";
    ctx.fillText("Press:", canvasWidth/4, canvasHeight/4);
    
    if(settingState === "none"){
        ctx.fillText("1) Computer vs Player", canvasWidth/2, canvasHeight*3/8);
        ctx.fillText("2) Player vs Player", canvasWidth/2, canvasHeight*5/8);
    }
    
    if(settingState === "CvP"){
        ctx.fillText("1) Use Keyboard (Up/Down)", canvasWidth/2, canvasHeight*3/8);
        ctx.fillText("2) Use Mouse (Up/Down)", canvasWidth/2, canvasHeight*5/8);
    }
    
    if(settingState === "PvP"){
        ctx.fillText("1) Mouse vs Keyboard", canvasWidth/2, canvasHeight*3/8);
        ctx.fillText("2) Keyboard vs Mouse", canvasWidth/2, canvasHeight*4/8);
        ctx.fillText("3) Keyboard vs Keyboard", canvasWidth/2, canvasHeight*5/8);
    }
}


function redrawPrePlay()
{
       ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    

    ctx.textAlign = "center";
    ctx.fillStyle = "white"; 
    ctx.font = "20px Arial";

    
    
    if(settingState === "CvP"){
        if(player2.control === "keyboard"){
            ctx.fillText("Use the up/down arrow keys to move the paddle", canvasWidth/2, canvasHeight*3/8);
            ctx.font = "25px Arial";
            ctx.fillText("Press 'S' to Start!", canvasWidth/2, canvasHeight*6/8);
        }
        if(player2.control === "mouse"){
            ctx.fillText("Use the mouse to move the paddle", canvasWidth/2, canvasHeight*3/8);
            ctx.font = "25px Arial";
            ctx.fillText("Press 'S' to Start!", canvasWidth/2, canvasHeight*6/8);
        }
    }
    
    if(settingState === "PvP"){
        if(player2.control === "keyboard" && player1.control === "keyboard"){
            ctx.fillText("Player 1 : Use the w/s keys to move the paddle", canvasWidth/2, canvasHeight*3/8);
            ctx.fillText("Player 2 : Use the up/down arrow keys to move the paddle", canvasWidth/2, canvasHeight*4/8);
            ctx.font = "25px Arial";
            ctx.fillText("Press 'S' to Start!", canvasWidth/2, canvasHeight*6/8);
        }
        if(player2.control === "mouse" && player1.control === "keyboard"){
            ctx.fillText("Player 1 : Use the w/s keys to move the paddle", canvasWidth/2, canvasHeight*3/8);
            ctx.fillText("Player 2 : Use the mouse to move the paddle", canvasWidth/2, canvasHeight*4/8);
            ctx.font = "25px Arial";
            ctx.fillText("Press 'S' to Start!", canvasWidth/2, canvasHeight*6/8);
        }
        if(player2.control === "keyboard" && player1.control === "mouse"){
            ctx.fillText("Player 1 : Use the mouse to move the paddle", canvasWidth/2, canvasHeight*3/8);
            ctx.fillText("Player 2 : Use the up/down arrow keys to move the paddle", canvasWidth/2, canvasHeight*4/8);
            ctx.font = "25px Arial";
            ctx.fillText("Press 'S' to Start!", canvasWidth/2, canvasHeight*6/8);
        }

    } 

}

function redrawInstructions()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); 

    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Instructions", canvasWidth/2 , canvasHeight/8);
    
    ctx.font = "15px Arial";
    ctx.fillText("This is a simple game of Pong!", canvasWidth/2, canvasHeight*4/16);
    ctx.textAlign = "left";

    ctx.fillText("Good Luck!", canvasWidth/4, canvasHeight*12/16);
    ctx.fillText("Give your paddle size a boost by touching the orange ball", canvasWidth/4, canvasHeight*11/16);
    ctx.fillText("Your goal is to keep the ball from touching your end of the wall", canvasWidth/4, canvasHeight*5/16);
    ctx.fillText("The first player to reach a score of 15 wins!", canvasWidth/4, canvasHeight*6/16);   
    ctx.fillText("Use the edges of your paddle to make the ball go up/down more", canvasWidth/4, canvasHeight*8/16);
    ctx.fillText("Use the center of the paddle to simply reflect the ball", canvasWidth/4, canvasHeight*9/16);
    ctx.fillText("Use the space between the center and the edges to accelerate your ball!", canvasWidth/4, canvasHeight*10/16);
    
    
    ctx.fillText("Press 'P' to Play!!!", canvasWidth*11/16, canvasHeight*14/16);
    ctx.fillText("Press 'Q' to return to the Menu", canvasWidth*11/16, canvasHeight*15/16);
}

function redrawPause()
{
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = "40px Arial"
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Paused", canvasWidth/8, canvasHeight/8);
    
    ctx.textAlign = "left";
    ctx.font = "12px Arial";
    ctx.fillText("Press 'R' to Return to Game", canvasWidth*6/8, canvasHeight*14/16);
    ctx.fillText("Press 'Q' to Go to Menu", canvasWidth*6/8, canvasHeight*15/16);

}

function redrawGameOver()
{
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = "40px Arial"
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    if (player1.score === maxScore)
        ctx.fillText("Player 1 Won !!", canvasWidth/2, canvasHeight/2);
    if (player2.score === maxScore)
        ctx.fillText("Player 2 Won !!", canvasWidth/2, canvasHeight/2);

    ctx.textAlign = "left";
    ctx.font = "12px Arial";
    ctx.fillText("Press 'R' to Restart Game", canvasWidth*6/8, canvasHeight*14/16);
    ctx.fillText("Press 'Q' to Go to Menu", canvasWidth*6/8, canvasHeight*15/16);

}

function redrawAll(ball)
{
    // erase everything -- not efficient, but simple
    ctx.clearRect(0, 0, 800, 400);

    redrawBackground();
    redrawPowerUp(powerUpBigPaddle);    
    redrawBall(ball);
    redrawPaddles();
    
    redrawScore();
 //   redrawBoundary();
    
}


function redrawPowerUp(p)
{
    if (p.isActive)
    {
        drawCircle(ctx, p.cx, p.cy, p.radius, p.color);
    }
}

function redrawBoundary()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 10, canvasHeight);
    ctx.fillRect(canvasWidth - 10, 0, 10, canvasHeight);

}

function redrawBackground()
{

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = "white";
    ctx.moveTo(canvasWidth/2,0);
    ctx.lineTo(canvasWidth/2,canvasHeight);
    ctx.stroke();
        
        function drawBGOutline(ctx, cx, cy, radius) 
        {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.stroke();
        }

    drawBGOutline(ctx, canvasWidth/2, canvasHeight/2, canvasHeight/4);
}

function drawCircle(ctx, cx, cy, radius, color) 
{
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
   
    ctx.fillStyle = color;
    ctx.fill();
}

function redrawBall(ball) 
{    
    drawCircle(ctx, ball.cx, ball.cy, ball.radius, ball.color);
} 


function redrawPaddles()
{
    function roundedRect(ctx, x, y, width, height, radius, color)
    {
        ctx.beginPath();
        ctx.moveTo(x,y+radius);
        ctx.lineTo(x,y+height-radius);
        ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
        ctx.lineTo(x+width-radius,y+height);
        ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
        ctx.lineTo(x+width,y+radius);
        ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
        ctx.lineTo(x+radius,y);
        ctx.quadraticCurveTo(x,y,x,y+radius);
        ctx.fillStyle = color;
        ctx.fill();
    }

    roundedRect(ctx, paddle1.cx, paddle1.cy, paddle1.paddleWidth, paddle1.paddleHeight, paddle1.radius, "blue");
    roundedRect(ctx, paddle2.cx, paddle2.cy, paddle2.paddleWidth, paddle2.paddleHeight, paddle2.radius, "red");
}

function redrawScore()
{
    var player1score = "" + player1.score;
    var player2score = "" + player2.score;

    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(player1score, canvasWidth/2 - 30, 50);
    ctx.fillText(player2score, canvasWidth/2 + 30, 50);
}


function restartGame()
{
    ball.cx = initBallX;
    ball.cy = initBallY;
    ball.xSpeed = initBallXSpeed;
    ball.ySpeed = initBallYSpeed;

    paddle1.paddleHeight = initPaddleHeight;

    paddle1.cy = initPaddle1Y;
    paddle2.cy = initPaddle2Y;

    player1.score = 0;
    player2.score = 0;

    powerUpBigPaddle.isActive = false;
}


function onKeyDown(event)
{
    var currDown = 'key=' + event.keyCode;
    keysPressed[currDown] = event.keyCode;

    if (page.level === "gameover"){
        if (event.keyCode === 82){
            restartGame();
            page.level = "play";
            onTimer();
        }
        if (event.keyCode === 81){
            settingState = "none";
            page.level = "home";
            onTimer();
        }
    }

    if (page.level === "home"){
        if (event.keyCode === 80 || event.keyCode === 112)
            page.level = "settings";
        if (event.keyCode === 73 || event.keyCode === 105)
            page.level = "instructions";
    }
    
    if (page.level === "instructions"){
        if (event.keyCode === 80) 
            page.level = "settings";
        if (event.keyCode === 81)
            page.level = "home";
    }
    
    if (page.level === "settings") {

        if (event.keyCode === 73)
            page.level = "instructions";

        if (event.keyCode === 49) {
            if(settingState === "CvP") {
                player2.control = "keyboard";
                page.level = "preplay";
            }

            if(settingState === "none"){
                player1.control = "AI";
                settingState = "CvP";
            }

            if(settingState === "PvP"){
                player1.control = "mouse";
                player2.control = "keyboard";
                page.level = "preplay";
            }
            

        }
        if (event.keyCode === 50) {

            if(settingState === "CvP"){
                player2.control = "mouse";
                page.level = "preplay"
            }
            if(settingState === "PvP"){
                player1.control = "keyboard";
                player2.control = "mouse";
                page.level = "preplay";
            }
            if(settingState === "none")
                settingState = "PvP";
            
        }
        
        if (event.keyCode === 51) {
            if(settingState === "PvP"){
                player1.control = "keyboard";
                player2.control = "keyboard";
                page.level = "preplay";
            }   
        }
            
    }

    if (page.level === "preplay"){
        if (event.keyCode === 83){
            page.level = "play";
        }     
    }
            
    if (page.level === "play"){
        if (event.keyCode === 81)
            page.level = "home";
        if (event.keyCode === 80){
            page.level = "pause";
            Pause();
        }
    }
    
    if(page.level === "pause"){
        if (event.keyCode === 82)
            page.level = "play";
        if (event.keyCode === 81){
            page.level = "home";
            settingState = "none";
        }
    }
}

function onKeyUp(event)
{
    var currUp = 'key=' + event.keyCode;
    keysPressed[currUp] = 0;  
}


function updatePaddles()
{
    var key;

    for (key in keysPressed) 
    {
        if (keysPressed[key] === 38 && player2.control === "keyboard") // up arrow / player2 up
        {
            if(paddle2.cy - paddle2.radius>= 0) // added these so the paddles don't out of bounds
                movePaddleUp(paddle2, 4);
        }
        if (keysPressed[key] === 40 && player2.control === "keyboard") // down arrow / player2 down
        {
            if(paddle2.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
                movePaddleDown(paddle2, 4);
        }
        if (keysPressed[key] === 87 && player1.control === "keyboard") // w / player1 up
        {
            if(paddle1.cy - paddle1.radius>= 0)
                movePaddleUp(paddle1, 4);
        }
        if (keysPressed[key] === 83 && player1.control === "keyboard") // s / player1 down
        {
            if(paddle1.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
                movePaddleDown(paddle1, 4);
        }
    }
}


function movePaddleUp(paddle, speed)
{
    paddle.cy -= speed;
}

function movePaddleDown(paddle, speed)
{
    paddle.cy += speed;
}


function computerPlayer(ball, paddle)
{
    if(player1.control === "AI"){
        if (ball.cy < paddle.cy && ball.cx < canvasWidth * 0.75)
            movePaddleUp(paddle, 4);
        if (ball.cy > (paddle.cy + paddle.paddleHeight) && ball.cx < canvasWidth  * 0.75)
            movePaddleDown(paddle, 4);
    }
}

function isScore(ball) // checks if the ball has left the board and places it back in the center
{
    if (ball.cx + ball.radius >= ballBounds.edgeRight){
        player1.score += 1;
        console.log(" Player 1 scored!");
        ball.cx = canvasWidth/2;
        ball.cy = canvasHeight/2;
        ball.xSpeed = -Math.floor((Math.random() * 3) + 3);
        ball.ySpeed = Math.floor((Math.random() * 3) + 3)*Math.pow(-1, Math.round(Math.random())) ;
        setTimeout(onTimer, timerDelay * 10);
        return true;
    }
    
    if (ball.cx - ball.radius <= ballBounds.edgeLeft){
        player2.score += 1;
        console.log("Player 2 scored!");
        ball.cx = canvasWidth/2;
        ball.cy = canvasHeight/2;
        ball.xSpeed = Math.floor((Math.random() * 3) + 3);
        ball.ySpeed = Math.floor((Math.random() * 3) + 3)*Math.pow(-1, Math.round(Math.random()));
        setTimeout(onTimer, timerDelay * 10);
        // if (player2.score === 5){
        //     page.level = "gameover";
        //     redrawGameOver();
        // }
        return true;
    }

    return false;
}


// not really a ball, lol
function missedPowerUp(ball) // checks if the ball has left the board and places it back in the center
{
    if (ball.cx + ball.radius >= ballBounds.edgeRight){
        ball.cx = canvasWidth * 3/4;
        ball.cy = canvasHeight/2;
        ball.xSpeed = -4;
        ball.ySpeed = 4;
        ball.isActive = false;
        return true;
    }
    
    if (ball.cx - ball.radius <= ballBounds.edgeLeft){
    
        ball.cx = canvasWidth/4;
        ball.cy = canvasHeight/2;
        ball.xSpeed = 4;
        ball.ySpeed = -4;
        ball.isActive = false;
        return true;
    }

    return false;
}
 

function bounceEdge(ball)
{
    // I thought that given the bounceMiddle(), it was fair that the ySpeed should increase too(?) 
    // You can change this back if you don't like it :D
    if(Math.abs(ball.xSpeed * 0.7) > minSpeed) {
    ball.xSpeed = -0.7*ball.xSpeed;
    } else {
        ball.xSpeed = -ball.xSpeed;
    }
    ball.ySpeed = -1.3*ball.ySpeed;
}

function bounceCenter(ball)
{
    ball.xSpeed = -ball.xSpeed;
}

function bounceMiddle(ball)
{
    // I gave the ball a maximum xSpeed because when the ball became too fast, it went through the paddle
    if (Math.abs(ball.xSpeed*1.3) < maxSpeed) {
    ball.xSpeed = -ball.xSpeed * 1.3;
    } else {
        ball.xSpeed = -ball.xSpeed;
    }
    ball.ySpeed = ball.ySpeed * 0.7;
}

function touchingTop(ball)
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.2)) && (ball.cy + ball.radius) >= paddle1.cy)
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.2)) && (ball.cy + ball.radius) >= paddle2.cy)
            return true;
    }
   
    return false;
}

function touchingMiddleUp(ball)
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.4)) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.2)))
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.4)) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.2)))
            return true;
    }
   
    return false;
}


function touchingCenter(ball)
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.6)) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.4)))
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.6)) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.4)))
            return true;
    }
   
    return false;
}

function touchingMiddleDown(ball)
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.8)) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.6)))
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.8)) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.6)))
            return true;
    }
   
    return false;
}


function touchingBottom(ball)
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if ((ball.cy - ball.radius) <= (paddle1.cy + paddle1.paddleHeight) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.8)))
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if ((ball.cy - ball.radius) <= (paddle2.cy + paddle2.paddleHeight) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.8)))
            return true;
    }
   
    return false;
}


function activatePowerUp()
{
    if (powerUpBigPaddle.isActive)
       powerUpBigPaddle.isActive = false;
    else
      powerUpBigPaddle.isActive = true;

  setTimeout(activatePowerUp, powerUpBigPaddle.frequency * 1000);
}   


function BoundaryBouncePlay(ball)
{
    if (ball.cy + ball.radius >= ballBounds.edgeDown || ball.cy - ball.radius <= ballBounds.edgeUp)
        ball.ySpeed = -ball.ySpeed;    
}


function BoundaryBounceHome(ball)
{
    if (ball.cy + ball.radius >= ballBounds.edgeDown || ball.cy - ball.radius <= ballBounds.edgeUp)
        ball.ySpeed = -ball.ySpeed;  

    if (ball.cx + ball.radius >= ballBounds.edgeRight || ball.cx - ball.radius <= ballBounds.edgeLeft)
        ball.xSpeed = -ball.xSpeed;   
}

function PaddleBouncePlay(ball, paddle1, paddle2)
{
    if (touchingTop(ball) || touchingBottom(ball))
        bounceEdge(ball);
    if (touchingCenter(ball))
        bounceCenter(ball);
    if (touchingMiddleDown(ball) || touchingMiddleUp(ball))
        bounceMiddle(ball);
}



function PaddleBounceHome(ball, paddle1, paddle2)
{
    return;
}

function PaddleBouncePowerUp(ball, paddle1, paddle2)
{

    if (ball.isActive === true)
    {
        if ((touchingTop(ball) || touchingBottom(ball) || touchingCenter(ball) || touchingMiddleDown(ball) || touchingMiddleUp(ball)))
        {
             if (ball.xSpeed > 0)
             {
                paddle2.paddleHeight = 135;
                ball.cx = canvasWidth * 3/4;
                ball.cy = canvasHeight/2;
                ball.xSpeed = -4;
                setTimeout(endPowerUp, powerUpBigPaddle.duration);

            }
            else
            {
                paddle1.paddleHeight = 135;
                ball.cx = canvasWidth/4;
                ball.cy = canvasHeight/2;
                ball.xSpeed = 4;
                setTimeout(endPowerUp, powerUpBigPaddle.duration);

            }
            ball.isActive = false;
        }
    }
    
}


function endPowerUp()
{
    paddle1.paddleHeight = 60;
    paddle2.paddleHeight = 60;
}



function setNextBallLocation(ball, paddle1, paddle2, boundaryBounceFn, paddleBounceFn)
{
    
    boundaryBounceFn(ball);

    paddleBounceFn(ball, paddle1, paddle2);

    ball.cx += ball.xSpeed;
    ball.cy += ball.ySpeed;

    // at this point, we may have exceeded the ball bounds. Thus, if we have, then meet the edge exactly.
    if (ball.cx + ball.radius >= ballBounds.edgeRight)
        ball.cx = ballBounds.edgeRight - ball.radius;

    if (ball.cx - ball.radius <= ballBounds.edgeLeft)
        ball.cx = ballBounds.edgeLeft + ball.radius;

    if (ball.cy + ball.radius >= ballBounds.edgeDown)
        ball.cy = ballBounds.edgeDown - ball.radius;

    if (ball.cy - ball.radius <= ballBounds.edgeUp)
        ball.cy = ballBounds.edgeUp + ball.radius;


    // at this point, if the ball is inside the paddle, make it touch the paddle edge exactly. 
    if(((ball.cx - ball.radius) < (paddle1.cx + paddle1.paddleWidth)) && ((ball.cx - ball.radius) > paddle1.cx)){
        if ((ball.cy - ball.radius) <= (paddle1.cy + paddle1.paddleHeight) && (ball.cy + ball.radius) >= paddle1.cy)
            ball.cx = paddle1.cx + paddle1.paddleWidth + ball.radius;
    }

    if((ball.cx + ball.radius) > paddle2.cx && (ball.cx + ball.radius) < (paddle2.cx + paddle2.paddleWidth)){
        if ((ball.cy - ball.radius) <= (paddle2.cy + paddle2.paddleHeight) && (ball.cy + ball.radius) >= paddle2.cy)
            ball.cx = paddle2.cx - ball.radius;
    }

}

function isGameOver()
{
    if (player1.score === maxScore || player2.score == maxScore)
        page.level = "gameover";
}


function Home()
{

    ctx.clearRect(0, 0, 800, 400);

    setNextBallLocation(ballHome1, paddle1, paddle2, BoundaryBounceHome, PaddleBounceHome);
    setNextBallLocation(ballHome2, paddle1, paddle2, BoundaryBounceHome, PaddleBounceHome);
    setNextBallLocation(ballHome3, paddle1, paddle2, BoundaryBounceHome, PaddleBounceHome);
    redrawHome();
    redrawBall(ballHome1);
    redrawBall(ballHome2);
    redrawBall(ballHome3);

}

function Play()
{
    if (isScore(ball) === true){
        return "score";
    }
    
    missedPowerUp(powerUpBigPaddle);
   // powerUpBigPaddle.isActive = true;

    // first find out the new coordinates of where to draw the ball
    setNextBallLocation(ball, paddle1, paddle2, BoundaryBouncePlay, PaddleBouncePlay);
    computerPlayer(ball, paddle1);
    updatePaddles();
    if (powerUpBigPaddle.isActive === true){
        setNextBallLocation(powerUpBigPaddle, paddle1, paddle2, BoundaryBounceHome, PaddleBouncePowerUp);
    }

    // then redraw it at that place
    redrawAll(ball);
    isGameOver();  
    return "notScore";
}

function Pause()
{
    redrawPause();
}

function Instructions()
{
    redrawInstructions();
}

function Settings ()
{
    redrawSettings();
}

function onTimer() // called every timerDelay millis
{
    if (page.level === "gameover"){
        redrawGameOver();
        return;
    }

    if (page.level === "home")
        Home();
    
    if (page.level === "settings")
        Settings();
    
    if (page.level === "play")
        if (Play() === "score")
            return;
            
    if (page.level === "instructions")
        Instructions();

    if (page.level === "preplay")
        redrawPrePlay();



    setTimeout(onTimer, timerDelay);

}

function onMouseMove(event) {
    var x = event.pageX - canvas.offsetLeft;  // do not use event.x, it's not cross-browser!!!
    var y = event.pageY - canvas.offsetTop;

    if (y < (canvasHeight - paddle2.paddleHeight/2) && y > paddle2.paddleHeight/2 && player2.control === "mouse")
        paddle2.cy = (y - paddle2.paddleHeight/2);
    if (y < (canvasHeight - paddle1.paddleHeight/2) && y > paddle1.paddleHeight/2 && player1.control === "mouse")
        paddle1.cy = (y - paddle1.paddleHeight/2);
    
}

function run() 
{
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    setTimeout(onTimer, timerDelay);
    setTimeout(activatePowerUp, powerUpBigPaddle.frequency * 1000);

    canvas.addEventListener('keyup', onKeyUp, false);
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
}

run();
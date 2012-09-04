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

function Ball(cx, cy, xSpeed, ySpeed, radius)
{
    this.cx = cx;
    this.cy = cy;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.radius = radius;
}

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
}

var ball = new Ball(200, 200, 4, 4, 10);
var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);
var paddle1 = new Paddle(20, (canvasHeight/2) - 50, 10, 100, 5, "one");
var paddle2 = new Paddle(canvasWidth - 25 - 5, (canvasHeight/2) - 50, 10, 100, 5, "two");
var player1 = new Player();
var player2 = new Player();
var maxSpeed = 10;
var minSpeed = 3;

function redrawAll()
{
    // erase everything -- not efficient, but simple
    ctx.clearRect(0, 0, 800, 400);
    
    redrawBall();
    redrawPaddles();
    redrawScore();
}


function redrawBall() 
{    
    function drawCircle(ctx, cx, cy, radius) 
    {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
    }

    drawCircle(ctx, ball.cx, ball.cy, ball.radius);
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

    ctx.strokeText(player1score, canvasWidth/2 - 50, 50);
    ctx.strokeText(player2score, canvasWidth/2 + 20, 50);
}

function onKeyDown(event)
{
    var currDown = 'key=' + event.keyCode;
    keysPressed[currDown] = event.keyCode;
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
        if (keysPressed[key] === 38) // up arrow / player2 up
        {
            if(paddle2.cy - paddle2.radius>= 0) // added these so the paddles don't out of bounds
                movePaddleUp(paddle2);
        }
        if (keysPressed[key] === 40) // down arrow / player2 down
        {
            if(paddle2.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
                movePaddleDown(paddle2);
        }
        if (keysPressed[key] === 87) // w / player1 up
        {
            if(paddle1.cy - paddle1.radius>= 0)
                movePaddleUp(paddle1);
        }
        if (keysPressed[key] === 83) // s / player1 down
        {
            if(paddle1.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
                movePaddleDown(paddle1);
        }
    };
}

function movePaddleUp(paddle)
{
    paddle.cy -= 7;
}

function movePaddleDown(paddle)
{
    paddle.cy += 7;
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
    }
    
    if (ball.cx - ball.radius <= ballBounds.edgeLeft){
        player2.score += 1;
        console.log("Player 2 scored!");
        ball.cx = canvasWidth/2;
        ball.cy = canvasHeight/2;
        ball.xSpeed = Math.floor((Math.random() * 3) + 3);
	ball.ySpeed = Math.floor((Math.random() * 3) + 3)*Math.pow(-1, Math.round(Math.random()));
    }
}



function isTouching() // checks if the ball is touching the paddles
{
    // if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
    //     if (ball.cy <= (paddle1.cy + paddle1.paddleHeight) && ball.cy >= paddle1.cy)
    //         return true;
    // }

    // if((ball.cx + ball.radius) === paddle2.cx){
    //     if (ball.cy <= (paddle2.cy + paddle2.paddleHeight) && ball.cy >= paddle2.cy)
    //         return true;
    // }
   
    // return false;



    if (touchingTop() === true)
        return true;
    if (touchingMiddleUp() == true)
        return true;
    if (touchingCenter() == true)
        return true;
    if (touchingMiddleDown() == true)
        return true;
    if (touchingBottom() == true)
        return true;

    return false;
}  

function bounceEdge()
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

function bounceCenter()
{
    ball.xSpeed = -ball.xSpeed;
}

function bounceMiddle()
{
    // I gave the ball a maximum xSpeed because when the ball became too fast, it went through the paddle
    if (Math.abs(ball.xSpeed*1.3) < maxSpeed) {
	ball.xSpeed = -ball.xSpeed * 1.3;
    } else {
        ball.xSpeed = -ball.xSpeed;
    }
    ball.ySpeed = ball.ySpeed * 0.7;
}

function touchingTop()
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.2)) && ball.cy >= paddle1.cy)
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.2)) && ball.cy >= paddle2.cy)
            return true;
    }
   
    return false;
}

function touchingMiddleUp()
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


function touchingCenter()
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

function touchingMiddleDown()
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


function touchingBottom()
{
    if((ball.cx - ball.radius) === (paddle1.cx + paddle1.paddleWidth)){
        if (ball.cy <= (paddle1.cy + paddle1.paddleHeight) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.8)))
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + paddle2.paddleHeight) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.8)))
            return true;
    }
   
    return false;
}








function setNextBallLocation(ball, paddle1, paddle2)
{
    if (ball.cy + ball.radius >= ballBounds.edgeDown || ball.cy - ball.radius <= ballBounds.edgeUp)
        ball.ySpeed = -ball.ySpeed;

    // if(isTouching()) // so the the balls bounce off the paddles
    //     ball.xSpeed = -ball.xSpeed;
    

    if (touchingTop() || touchingBottom())
        bounceEdge();
    if (touchingCenter())
        bounceCenter();
    if (touchingMiddleDown() || touchingMiddleUp())
        bounceMiddle();


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
        if (ball.cy <= (paddle1.cy + paddle1.paddleHeight) && ball.cy >= paddle1.cy)
            ball.cx = paddle1.cx + paddle1.paddleWidth + ball.radius;
    }

    if((ball.cx + ball.radius) > paddle2.cx && (ball.cx + ball.radius) < (paddle2.cx + paddle2.paddleWidth)){
        if (ball.cy <= (paddle2.cy + paddle2.paddleHeight) && ball.cy >= paddle2.cy)
            ball.cx = paddle2.cx - ball.radius;
    }

}

function onTimer() // called every timerDelay millis
{

    isScore(ball);
    // first find out the new coordinates of where to draw the ball
    setNextBallLocation(ball, paddle1, paddle2);
    updatePaddles();
    // then redraw it at that place
    redrawAll();


}

function run() 
{
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    intervalId = setInterval(onTimer, timerDelay); // call onTimer every timerDelay millis
    
    canvas.addEventListener('keyup', onKeyUp, false);
    canvas.addEventListener('keydown', onKeyDown, false);
}

run();
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

var ball = new Ball(200, 200, 4, 4, 10);
var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);
var paddle1 = new Paddle(20, (canvasHeight/2) - 50, 10, 100, 5, "one");
var paddle2 = new Paddle(canvasWidth - 25 - 5, (canvasHeight/2) - 50, 10, 100, 5, "two");

function redrawAll()
{
    // erase everything -- not efficient, but simple
    ctx.clearRect(0, 0, 800, 400);
    
    redrawBall();
    redrawPaddles();
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
            movePaddleUp(paddle2);
        }
        if (keysPressed[key] === 40) // down arrow / player2 down
        {
            movePaddleDown(paddle2);
        }
        if (keysPressed[key] === 87) // w / player1 up
        {
            movePaddleUp(paddle1);
        }
        if (keysPressed[key] === 83) // s / player1 down
        {
            movePaddleDown(paddle1);
        }
    };
}

function movePaddleUp(paddle)
{
    paddle.cy -= 5;
}

function movePaddleDown(paddle)
{
    paddle.cy += 5;
}


function setNextBallLocation(ball)
{

    if (ball.cx + ball.radius >= ballBounds.edgeRight || ball.cx - ball.radius <= ballBounds.edgeLeft)
        ball.xSpeed = -ball.xSpeed;

    if (ball.cy + ball.radius >= ballBounds.edgeDown || ball.cy - ball.radius <= ballBounds.edgeUp)
        ball.ySpeed = -ball.ySpeed;

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
}

function onTimer() // called every timerDelay millis
{
    // first find out the new coordinates of where to draw the ball
    setNextBallLocation(ball);
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
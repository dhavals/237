var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var intervalId;
var timerDelay = 10;
var pressedKeys = [];


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

var ball = new Ball(200, 200, 10, 10, 10);
var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);



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
    roundedRect(ctx, 20, (canvasHeight/2) - 50, 10, 100, 5, "blue");
    roundedRect(ctx, canvasWidth - 25 - 5, (canvasHeight/2) - 50, 10, 100, 5, "red");
}

function onKeyDown(event)
{
    pressedKeys[event.keyCode] = true;
}


function onKeyUp(event)
{
    pressedKeys[event.keyCode] = false;
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
    // then redraw it at that place
    redrawAll();
}

function run() 
{
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    intervalId = setInterval(onTimer, timerDelay); // call onTimer every timerDelay millis
}

run();
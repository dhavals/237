var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var intervalId;
var timerDelay = 10;

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
//var ballBounds = new BallBounds(0 + ball.radius, canvasHeight - ball.radius, 0 + ball.radius, canvasWidth - ball.radius);
var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);

function redrawBall() 
{
    // erase everything -- not efficient, but simple
    ctx.clearRect(0, 0, 800, 400);
    
    function drawCircle(ctx, cx, cy, radius) 
    {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    drawCircle(ctx, ball.cx, ball.cy, ball.radius);
} 

function setNextBallLocation(ball)
{

    if (ball.cx + ball.radius >= ballBounds.edgeRight || ball.cx - ball.radius <= ballBounds.edgeLeft)
        ball.xSpeed = -ball.xSpeed;

    if (ball.cy + ball.radius >= ballBounds.edgeDown || ball.cy - ball.radius <= ballBounds.edgeUp)
        ball.ySpeed = -ball.ySpeed;

    ball.cx += ball.xSpeed;
    ball.cy += ball.ySpeed;

    // if (ball.radius < 45)
    //     ball.radius++;
    // else
    //     ball.radius = 10;

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
    redrawBall();
}

function run() 
{
    // make canvas focusable, then give it focus!
    canvas.setAttribute('tabindex','0');
    canvas.focus();

    intervalId = setInterval(onTimer, timerDelay); // call onTimer every timerDelay millis
}

run();
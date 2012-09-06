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
	this.control = "keyboard";
}

function DisplayPage(level)
{
    this.level = level;
}

var ball = new Ball(200, 200, 4, 4, 7);
var ballHome1 = new Ball(250, 200, 3, 4, 7);
var ballHome2 = new Ball(350, 250, -3, 5, 7);
var ballHome3 = new Ball(10, 50, 3, -4, 7);
var ballBounds = new BallBounds(0, canvasHeight, 0, canvasWidth);
var paddle1 = new Paddle(25, (canvasHeight/2) - 50, 10, 100, 5, "one");
var paddle2 = new Paddle(canvasWidth - 30 - 5, (canvasHeight/2) - 50, 10, 100, 5, "two");
var player1 = new Player();
var player2 = new Player();
var page = new DisplayPage("home");
var settingState = "none";
var maxSpeed = 10;
var minSpeed = 3;

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
		ctx.font = "12px Arial";
		ctx.fillText("Press 'P' to play", canvasWidth*7/8, canvasHeight*7/8);
	}
	
	if(settingState === "PvP"){
		ctx.fillText("1) Mouse vs Keyboard", canvasWidth/2, canvasHeight*3/8);
		ctx.fillText("2) Keyboard vs Mouse", canvasWidth/2, canvasHeight*4/8);
		ctx.fillText("3) Keyboard vs Keyboard", canvasWidth/2, canvasHeight*5/8);
		ctx.font = "12px Arial";
		ctx.fillText("Press 'P' to play", canvasWidth*7/8, canvasHeight*7/8);
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
}


function redrawAll(ball)
{
    // erase everything -- not efficient, but simple
    ctx.clearRect(0, 0, 800, 400);

    redrawBackground()
    redrawBall(ball);
    redrawPaddles();
    redrawScore();
    redrawBoundary();
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

    function drawCircle(ctx, cx, cy, radius) 
    {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.stroke();
    }

    drawCircle(ctx, canvasWidth/2, canvasHeight/2, canvasHeight/4);
}

function redrawBall(ball) 
{    
    function drawCircle(ctx, cx, cy, radius) 
    {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "yellow";
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
    ctx.fillStyle = "white";
    ctx.fillText(player1score, canvasWidth/2 - 30, 50);
    ctx.fillText(player2score, canvasWidth/2 + 30, 50);
}

function onKeyDown(event)
{
    var currDown = 'key=' + event.keyCode;
    keysPressed[currDown] = event.keyCode;

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
			if(settingState === "none"){
				player1.control = "AI";
				settingState = "CvP";
			}
			if(settingState === "CvP") {
				player2.control = "keyboard";
			}
			if(settingState === "PvP"){
				player1.control = "mouse";
				player2.control = "keyboard";
			}
		}
		if (event.keyCode === 50) {
			if(settingState === "none")
				settingState = "PvP";
			if(settingState === "CvP"){
				player2.control = "mouse";
			}
			if(settingState === "PvP"){
				player1.control = "keyboard";
				player2.control = "mouse";
			}
			
		}
		
		if (event.keyCode === 51) {
			if(settingState === "PvP"){
				player1.control = "keyboard";
				player2.control = "mouse";
			}	
		}
		
		if (event.keyCode === 80) {
			if(settingState === "CvP"){
				page.level = "play";
			} if (settingState === "PvP") {
				page.level = "play";
			}
		}
			
	}
			
	if (page.level === "play"){
		if (event.keyCode === 81)
			page.level = "home";
		if (event.keyCode === 80)
			page.level = "pause";
	}
	
	if(page.level === "pause"){
		if (event.keyCode === 80)
			page.level = "play";
		if (event.keyCode === 81)
			page.level = "home";
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
        if (keysPressed[key] === 38) // up arrow / player2 up
        {
            if(paddle2.cy - paddle2.radius>= 0) // added these so the paddles don't out of bounds
                movePaddleUp(paddle2, 4);
        }
        if (keysPressed[key] === 40) // down arrow / player2 down
        {
            if(paddle2.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
                movePaddleDown(paddle2, 4);
        }
        if (keysPressed[key] === 87) // w / player1 up
        {
            if(paddle1.cy - paddle1.radius>= 0)
                movePaddleUp(paddle1, 4);
        }
        if (keysPressed[key] === 83) // s / player1 down
        {
            if(paddle1.cy + paddle2.paddleHeight + paddle2.radius<= canvas.height)
                movePaddleDown(paddle1, 4);
        }
    };
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
        return true;
    }

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
        if (ball.cy <= (paddle1.cy + (paddle1.paddleHeight * 0.2)) && (ball.cy + ball.radius) >= paddle1.cy)
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if (ball.cy <= (paddle2.cy + (paddle2.paddleHeight * 0.2)) && (ball.cy + ball.radius) >= paddle2.cy)
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
        if ((ball.cy - ball.radius) <= (paddle1.cy + paddle1.paddleHeight) && ball.cy > (paddle1.cy + (paddle1.paddleHeight * 0.8)))
            return true;
    }

    if((ball.cx + ball.radius) === paddle2.cx){
        if ((ball.cy - ball.radius) <= (paddle2.cy + paddle2.paddleHeight) && ball.cy > (paddle2.cy + (paddle2.paddleHeight * 0.8)))
            return true;
    }
   
    return false;
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
    if (touchingTop() || touchingBottom())
        bounceEdge();
    if (touchingCenter())
        bounceCenter();
    if (touchingMiddleDown() || touchingMiddleUp())
        bounceMiddle();
}

function PaddleBounceHome(ball, paddle1, paddle2)
{
    return;
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
    if (isScore(ball) === true)
        return "score";
    
    // first find out the new coordinates of where to draw the ball
    setNextBallLocation(ball, paddle1, paddle2, BoundaryBouncePlay, PaddleBouncePlay);
    computerPlayer(ball, paddle1)
    updatePaddles();
    // then redraw it at that place
    redrawAll(ball);  
    return "notScore";
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

    if (page.level === "home")
        Home();
    
	if (page.level === "settings")
	    Settings();
	
    if (page.level === "play")
        if (Play() === "score")
            return;

    if (page.level == "instructions")
        Instructions();


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
 
    canvas.addEventListener('keyup', onKeyUp, false);
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
}

run();
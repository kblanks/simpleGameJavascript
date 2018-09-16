//SETUP VARIABLES
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var player;
var platforms = [] ;
//CONSTANTS
const dt=.02; //time step
const g=9.81; //gravity (m/s^2)
	
//MAIN CODE
startGame() //setup stuff
setInterval(updateGameArea,dt*1000) //set game loop interval

//INITALIZATION
function startGame() {
	initPlayer();
	initPlatforms();
	setupKeyListeners();
}

//GAME LOOP
function updateGameArea() {
	movementLoop();
	drawingLoop();
}

//MOVEMENT
movementLoop = function(){
	move();
	checkFloorCollision();
	checkWallCollision();
	isOnGround();
}

//DRAWING
drawingLoop = function(){
	clear();
	drawPlayer();
	drawPlatforms();
}

//INITIALIZATION FUNCTIONS
function initPlayer(){
	player = new ball();
}

function initPlatforms(){
	for (var i = 0; i < 3; i++) {
		platforms[i] = new platform();
	}
}

function setupKeyListeners(){
	 document.addEventListener('keypress', function (event) {
	 if (event.key == "w") {jump()}
	 else if (event.key == "a") {goLeft()}
	 else if (event.key == "d") {goRight()}
	 else if (event.key == "s") {brakes()}
	 });
}

//OBJECTS
function ball() {
    radius = 15;
	color = "blue";
	m = 1;; //mass to use for other calculations
	e=-0.7; //restitution factor
	u=3; //kinetic friction
	afx = u * g; //pre-calculate friction acceleration
    x = 20; //initial position
    y = 20; //initial y position
	vx = 0; //initial x velocity
    vy = 0; //initial y velocity
	ax = 0; //initial x acceleration
	ay = 0; //initial y acceleration
	onground=false; //not on the ground initially
	
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(x,y,radius,0,2*Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
    }
	this.logStats = function(){
		ctx.fillStyle=color;
		ctx.fillText("x: " + (Math.round(x)),x,10);
		ctx.fillText("y: " + (canvas.height - Math.round(y) - radius),x,20);
		ctx.fillText("vx: " + (Math.round(vx)),x,30);
		ctx.fillText("vy: " + (Math.round(vy)*-1),x,40);
	}
}

function platform(){
	this.color = "red";
	this.x = Math.floor(Math.random() * canvas.width); 
	this.y = Math.floor(Math.random() * canvas.height);
	this.width = Math.floor(Math.random() * 200) + 40; //random number between 40 and 200
	
	this.draw = function(){
		ctx.fillStyle=this.color;
		ctx.fillRect(this.x,this.y,this.width,10)
	}
}

//PLAYER MOVEMENT FUNCTIONS
function jump(){
	ay=0;
	vy = -3;
}

function goLeft(){
	vx -= 50;
}

function goRight(){
	vx += 50;
}

function brakes(){
	if (vx > 0) {vx += -10;}
	else if (vx < 0) {vx += 10;}
}

//MOVEMENT FUNCTIONS
move = function() {
	ay = 0;
	ay += this.m * g; 
	
	//friction
	if (onground==true){
		if (vx > 0) {ax = -afx}
		else if (vx < 0) {ax = afx}
	}
	else {ax=0;} //only apply kinetic friction while on the ground
	
	//Simple integration for the x-direction 
	vx += ax*dt;
	x += vx*dt;
	
	// Verlet integration for the y-direction
	dy = vy * dt + (0.5 * ay * dt * dt);
	y += dy*100 ;
	new_ay = ay / m;
	avg_ay = 0.5 * (new_ay + ay);
	vy += avg_ay * dt;
}
	
checkWallCollision = function(){
	//right edge
	if ((x+radius) >= canvas.width){
		ax *= -1;
		vx *= -1;
		x = canvas.width - radius;
	}
	//left edge
	if ((x-radius) <= 0){
		ax *= -1;
		vx *= -1;
		x = radius;
	}
	//top edge
	if ((y-radius) <= 0){
		vy *= -1;
		y = radius;
	}
}
	
checkFloorCollision = function(){
	//collision with floor
	if ((y + radius) >= canvas.height){
		if (vy <= 0.75) {
			vy=0;
			y = canvas.height - radius;
		}
		else {
			vy *= e;
			y = canvas.height - radius;
		}
	}
}

isOnGround = function(){
	if (((y + radius) == canvas.height)){
		onground=true;}
	else {onground=false;}
}

//DRAWING FUNCTIONS
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

drawPlayer = function(){
	player.draw();
	player.logStats(); //writing position and velocity to screen to help with sanity checks
}

drawPlatforms = function(){
	for (var i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}
}
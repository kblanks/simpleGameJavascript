//SETUP VARIABLES
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var balls = [];
var redBall,blueBall;
//CONSTANTS
const dt=.02; //time step
const g=9.81; //gravity (m/s^2)
	
//MAIN CODE
startGame()
setInterval(updateGameArea,dt*1000)

function startGame() {
	initBalls();
	setupKeyListeners();
}

function updateGameArea() {
	clear();
	ballsLoop();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setupKeyListeners(){
	 document.addEventListener('keypress', function (event) {
	 if (event.key == "w") {jump()}
	 else if (event.key == "a") {goLeft()}
	 else if (event.key == "d") {goRight()}
	 else if (event.key == "s") {brakes()}
	 });
}

function jump(){
	blueBall.ay=0;
	blueBall.vy = -3;
}

function goLeft(){
	blueBall.vx -= 50;
}

function goRight(){
	blueBall.vx += 50;
}

function brakes(){
	if (blueBall.vx > 0) {blueBall.vx += -10;}
	else if (blueBall.vx < 0) {blueBall.vx += 10;}
}

function initBalls(){
	redBall = new ball(15, "red", 1, 50, 50);
	blueBall = new ball(15, "blue", 0.01, 120, 50);
	balls = [redBall,blueBall];
}

function ballsLoop(){
	for (var i = 0; i < balls.length; i++) {
			balls[i].move();
			balls[i].checkFloorCollision();
			balls[i].checkWallCollision();
			balls[i].isOnGround();
			balls[i].draw();
			balls[i].logStats();
		}
}

function ball(radius, color, mass, x, y) {
    this.radius = radius;
	this.color = color;
	this.m=mass; //mass to use for other calculations
	this.e=-0.7; //restitution factor
	this.u=0.5; //kinetic friction
    this.x = x;
    this.y = y; 
	this.vx = 0;
    this.vy = 0; 
	this.ax = 0;
	this.ay = 0;
	this.onground=false;
	
	this.move = function() {
		this.ay = 0;
		this.ay += this.m * g; 
		
		if (this.onground==true){
		//friction (still figuring this part out)
			if (this.vx > 0) {this.ax = -this.u * g;}
			else if (this.vx < 0) {this.ax = this.u * g;}
		}
		//Simple integration for the x-direction 
		this.vx += this.ax*dt;
		this.x += this.vx*dt;
		
		//simple x motion
		//this.x += this.vx*dt;
		
		// Verlet integration for the y-direction
		this.dy = this.vy * dt + (0.5 * this.ay * dt * dt);
		this.y += this.dy*100 ;
		this.new_ay = this.ay / this.m;
		this.avg_ay = 0.5 * (this.new_ay + this.ay);
		this.vy += this.avg_ay * dt;
	}
	
	this.checkWallCollision = function(){
		//right edge
		if ((this.x+this.radius) >= canvas.width){
			this.vx *= -1;
			this.x = canvas.width - this.radius;
		}
		//left edge
		if ((this.x-this.radius) <= 0){
			this.vx *= -1;
			this.x = this.radius;
		}
		//top edge
		if ((this.y-this.radius) <= 0){
			this.vy *= -1;
			this.y = this.radius;
		}
	}
	
	this.checkFloorCollision = function(){
		//collision with floor
		if ((this.y + this.radius) >= canvas.height){
			if (this.vy <= 0.75) {
				this.vy=0;
				this.y = canvas.height - this.radius;
			}
			else {
				this.vy *= this.e;
				this.y = canvas.height - this.radius;
			}
		}
	}
	
	this.isOnGround = function(){
		if (((this.y + this.radius) == canvas.height)&&(this.vy==0)){
			this.onground=true;}
		else {this.onground=false;}
	}
	
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
    }
	this.logStats = function(){
		ctx.fillStyle=this.color;
		ctx.fillText("x: " + (Math.round(this.x)),this.x,10);
		ctx.fillText("y: " + (canvas.height - Math.round(this.y) - this.radius),this.x,20);
		ctx.fillText("vx: " + (Math.round(this.vx)),this.x,30);
		ctx.fillText("vy: " + (Math.round(this.vy)*-1),this.x,40);
	}
	
}
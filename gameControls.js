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
}

function updateGameArea() {
	clear();
	ballsLoop();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
			balls[i].draw();
			balls[i].logStats();
		}
}

function ball(radius, color, mass, x, y) {
    this.radius = radius;
	this.color = color;
	this.m=mass; //mass to use for other calculations
	this.e=-0.7;
    this.x = x;
    this.y = y; 
	this.vx = 0;
    this.vy = 0; 
	this.ax = 0;
	this.ay = 0;
	
	this.move = function() {
		this.ay = 0;
		this.ay += this.m * g; 
		
		/* Verlet integration for the y-direction */
		this.dy = this.vy * dt + (0.5 * this.ay * dt * dt);
		this.y += this.dy*100 ;
		this.new_ay = this.ay / this.m;
		this.avg_ay = 0.5 * (this.new_ay + this.ay);
		this.vy += this.avg_ay * dt;
	}
	
	this.stop = function() {
		this.vx=0;
		this.vy=0;
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
	
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
    }
	this.logStats = function(){
		ctx.fillStyle=this.color;
		ctx.fillText(canvas.height - Math.round(this.y) - this.radius,this.x,10);
		ctx.fillText(Math.round(this.vy)*-1,this.x,20);
	}
	
}
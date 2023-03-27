import Cell from './Cell.js';
import Vec2D from './Vec2D.js';

export default class PlayerCell extends Cell {
	dir = new Vec2D(0, 0);
	speed;
	score;
	socketId;

	constructor(x, y, color, score, socketId) {
		super(x, y, color, score);
		this.score = score;
		this.socketId = socketId;
		this.updateSpeed();
	}

	setDirection(x, y) {
		this.dir.x = x;
		this.dir.y = y;
	}

	update() {
		this.updateScore();
		this.move();
	}

	updateScore() {
		const area = Math.PI * Math.pow(this.radius, 2);
		this.score = Math.floor(area);
	}

	updateSpeed() {
		//this.speed = 10 / (Math.pow(this.size, 0.15) + 1000 / 60);
		this.speed = (2.2 * Math.pow(this.radius * 2, -0.43)) / 4;
	}

	move() {
		/*const len = this.dir.length();
		if (len <= this.radius) {
			this.dir.normalize();
			this.dir.multiply(1 - len);
		} else {
			this.dir.normalize();
			this.dir.multiply(this.speed);
		}*/
		this.dir.normalize();
		this.dir.multiply(this.speed);
		this.pos.add(this.dir);
	}

	eatCell(cell) {
		const area = Math.PI * Math.pow(this.radius, 2);
		const cellArea = Math.PI * Math.pow(cell.radius, 2);
		this.radius = Math.sqrt((area + cellArea) / Math.PI);
		this.updateSpeed();
	}

	canEatCell(cell) {
		if (
			this.pos.distance(cell.pos) < this.radius + cell.radius &&
			this.radius > cell.radius * 1.15
		) {
			this.eatCell(cell);
			return true;
		}
		return false;
	}
}

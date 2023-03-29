import Cell from './Cell.js';
import Vec2D from './Vec2D.js';
import Game from './Game.js';

export default class PlayerCell extends Cell {
	dir = new Vec2D(0, 0);
	speed;
	score;
	socketId;
	name;

	constructor(x, y, color, score, socketId, name) {
		super(x, y, color, score);
		this.score = score;
		this.socketId = socketId;
		this.name = name;
		this.updateSpeed();
	}

	setDirection(x, y) {
		this.dir.x = x;
		this.dir.y = y;
	}

	update() {
		this.updateScore();
		this.updateSpeed();
		this.move();
	}

	updateScore() {
		const area = Math.PI * Math.pow(this.radius, 2);
		this.score = Math.floor(area);
	}

	updateSpeed() {
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
		if (!PlayerCell.isXInMap(this.pos.x + this.dir.x)) this.dir.x = 0;
		if (!PlayerCell.isYInMap(this.pos.y + this.dir.y)) this.dir.y = 0;
		this.pos.add(this.dir);
	}

	eatCell(cell) {
		const area = Math.PI * Math.pow(this.radius, 2);
		const cellArea = Math.PI * Math.pow(cell.radius, 2);
		this.radius = Math.sqrt((area + cellArea) / Math.PI);
		this.updateSpeed();
	}

	canEatCell(cell) {
		if (this.socketId == cell.socketId) return false;
		if (
			this.radius > this.pos.distance(cell.pos) &&
			this.radius > cell.radius * 1.1
		) {
			this.eatCell(cell);
			return true;
		}
		return false;
	}

	static isXInMap(x) {
		return x >= -(Game.width / 2) && x <= Game.width / 2;
	}

	static isYInMap(y) {
		return y >= -(Game.height / 2) && y <= Game.height / 2;
	}
}

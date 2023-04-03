import Cell from './Cell.js';
import Vec2D from './Vec2D.js';
import Game from './Game.js';

export default class PlayerCell extends Cell {
	dir = new Vec2D(0, 0);
	speed;
	score;
	socketId;
	name;
	zoom;

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
		this.updateZoom();
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

	updateZoom() {
		this.zoom = 48 / Math.sqrt(this.radius);
	}

	move() {
		const len = this.dir.length();
		const vec = this.dir.normalize();
		vec.multiply(this.speed);
		const displayRadius = this.radius * this.zoom;
		if (len < displayRadius) {
			vec.multiply(1 - (displayRadius - len) / displayRadius);
		}
		this.pos.add(vec);
		this.returnInMapIfIsOut();
	}

	eatCell(cell) {
		const area = Math.PI * Math.pow(this.radius, 2);
		const cellArea = Math.PI * Math.pow(cell.radius, 2);
		this.radius = Math.sqrt((area + cellArea) / Math.PI);
		this.updateSpeed();
	}

	canEatCell(cell) {
		if (
			this.radius > this.pos.distance(cell.pos) &&
			this.radius > cell.radius * 1.1
		) {
			this.eatCell(cell);
			return true;
		}
		return false;
	}

	returnInMapIfIsOut() {
		const radius30Percent = this.radius * 0.3;
		if (this.pos.x <= -Game.width / 2 + radius30Percent) {
			this.pos.x = -Game.width / 2 + radius30Percent;
		}
		if (this.pos.x >= Game.width / 2 - radius30Percent) {
			this.pos.x = Game.width / 2 - radius30Percent;
		}
		if (this.pos.y <= -Game.height / 2 + radius30Percent) {
			this.pos.y = -Game.height / 2 + radius30Percent;
		}
		if (this.pos.y >= Game.height / 2 - radius30Percent) {
			this.pos.y = Game.height / 2 - radius30Percent;
		}
	}
}

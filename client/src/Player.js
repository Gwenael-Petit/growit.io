import Vec2D from './Vec2D.js';

export default class Player {
	pos;
	dir = new Vec2D(0, 0);
	size;
	speed;
	score;

	constructor(x, y, score) {
		this.pos = new Vec2D(x, y);
		this.size = Math.sqrt(score / Math.PI) * 2;
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
		const area = Math.PI * Math.pow(this.size / 2, 2);
		this.score = Math.floor(Math.sqrt(area));
	}

	updateSpeed() {
		this.speed = 20 / (Math.pow(this.size, 0.15) + 1000 / 60);
	}

	move() {
		this.dir.normalize();
		this.dir.multiply(this.speed);
		this.pos.add(this.dir);
	}

	eatFood(food) {
		const area = Math.PI * Math.pow(this.size / 2, 2);
		const foodArea = Math.PI * Math.pow(food.size / 2, 2);
		this.size = Math.sqrt((area + foodArea) / Math.PI) * 2;
		this.updateSpeed();
	}

	canEatFood(food) {
		if (this.pos.distance(food.pos) < this.size / 2 + food.size / 2) {
			this.eatFood(food);
			return true;
		}
		return false;
	}
}

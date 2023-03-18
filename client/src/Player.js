import Vec2D from './Vec2D.js';

export default class Player {

	pos;
	dir = new Vec2D(0, 0);
	diameter = 10;
	mass = 10;
	speed = 0;
	score = 10;

	constructor(x, y) {
		this.pos = new Vec2D(x, y);
	}

	update() {
		this.move();
	}

	move() {
		this.speed = 10 / Math.sqrt(this.diameter);
		this.dir.normalize();
		this.pos.add(this.dir);
	}

	setDirection(x, y) {
		this.dir.x = x;
		this.dir.y = y;
	}

	eatFood(food) {
		const factor = Math.sqrt(food.value);
		this.diameter += 0.1 * factor;
		this.mass += 0.01 * factor;
		this.score += food.value;
	}

	canEatFood(food) {
		if(this.pos.distance(food.pos) < this.diameter / 2) {
			this.eatFood(food);
			return true;
		}
		return false;
	}
}

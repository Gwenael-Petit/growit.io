import Cell from './Cell';
import Vec2D from '../../common/Vec2D';
import Game from './Game';

export default class PlayerCell extends Cell {
	dir: Vec2D = new Vec2D(0, 0);
	speed: number = 0;
	score: number;
	socketId: string;
	name: string;
	zoom: number = 0;
	vulnerable: boolean = false;

	joinTimeStamp: number = new Date().getTime();
	deathTimeStamp: number = 0;
	finalScore: number = 0;

	constructor(
		x: number,
		y: number,
		color: string,
		score: number,
		socketId: string,
		name: string
	) {
		super(x, y, color, score);
		this.score = score;
		this.socketId = socketId;
		this.name = name;
	}

	setDirection(x: number, y: number): void {
		this.dir.x = x;
		this.dir.y = y;
	}

	update(mapWidth: number, mapHeight: number): void {
		this.updateScore();
		this.updateZoom();
		this.updateSpeed();
		this.move(mapWidth, mapHeight);
		this.calculFinalScore();
	}

	updateScore(): void {
		const area = Math.PI * Math.pow(this.radius, 2);
		this.score = Math.floor(area);
	}

	updateSpeed(): void {
		this.speed = (2.2 * Math.pow(this.radius * 2, -0.43)) / 4;
	}

	updateZoom(): void {
		this.zoom = 48 / Math.sqrt(this.radius);
	}

	move(mapWidth: number, mapHeight: number): void {
		const len = this.dir.length();
		const vec = this.dir.normalize();
		vec.multiply(this.speed);
		const displayRadius = this.radius * this.zoom;
		if (len < displayRadius) {
			vec.multiply(1 - (displayRadius - len) / displayRadius);
		}
		this.pos.add(vec);
		this.returnInMapIfIsOut(mapWidth, mapHeight);
	}

	eatCell(cell: Cell): void {
		if (!this.vulnerable) this.vulnerable = true;
		const area = Math.PI * Math.pow(this.radius, 2);
		const cellArea = Math.PI * Math.pow(cell.radius, 2);
		this.radius = Math.sqrt((area + cellArea) / Math.PI);
		this.updateSpeed();
	}

	canEatCell(cell: Cell): boolean {
		if (
			this.radius > this.pos.distance(cell.pos) &&
			this.radius > cell.radius * 1.1
		) {
			this.eatCell(cell);
			return true;
		}
		return false;
	}

	returnInMapIfIsOut(mapWidth: number, mapHeight: number): void {
		const radius30Percent = this.radius * 0.3;
		if (this.pos.x <= -mapWidth / 2 + radius30Percent) {
			this.pos.x = -mapWidth / 2 + radius30Percent;
		}
		if (this.pos.x >= mapWidth / 2 - radius30Percent) {
			this.pos.x = mapWidth / 2 - radius30Percent;
		}
		if (this.pos.y <= -mapHeight / 2 + radius30Percent) {
			this.pos.y = -mapHeight / 2 + radius30Percent;
		}
		if (this.pos.y >= mapHeight / 2 - radius30Percent) {
			this.pos.y = mapHeight / 2 - radius30Percent;
		}
	}

	calculFinalScore() {
		this.finalScore =
			this.score * 5 +
			new Date(Date.now() - this.joinTimeStamp).getSeconds() * 2;
	}
}

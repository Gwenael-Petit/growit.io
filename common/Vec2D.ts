export default class Vec2D {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(other: Vec2D): void {
		this.x += other.x;
		this.y += other.y;
	}

	substract(other: Vec2D): void {
		this.x -= other.x;
		this.y -= other.y;
	}

	multiply(n: number): void {
		this.x *= n;
		this.y *= n;
	}

	length(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	normalize(): Vec2D {
		const newVec = new Vec2D(this.x, this.y);
		const len = this.length();
		if (len != 0) {
			newVec.x /= len;
			newVec.y /= len;
		}
		return newVec;
	}

	distance(other: Vec2D): number {
		return Math.sqrt(
			Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
		);
	}
}

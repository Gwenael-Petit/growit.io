import Vec2D from './Vec2D';

describe('A vector', () => {
	it('should add an other vector to the current', () => {
		const vec = new Vec2D(0, 0);
		const other = new Vec2D(2, 1);
		vec.add(other);
		expect(vec.x).toEqual(2);
		expect(vec.y).toEqual(1);
	});

	it('should substract an other vector to the current', () => {
		const vec = new Vec2D(0, 0);
		const other = new Vec2D(2, 1);
		vec.substract(other);
		expect(vec.x).toEqual(-2);
		expect(vec.y).toEqual(-1);
	});

	it('should multiply vector position by a factor', () => {
		const vec = new Vec2D(1, 1);
		vec.multiply(10);
		expect(vec.x).toEqual(10);
		expect(vec.y).toEqual(10);
	});

	it('should return the length of the vector', () => {
		const vec = new Vec2D(1, 1);
		expect(vec.length()).toEqual(Math.sqrt(2));
	});

	it('should return the normalize vector of the vector', () => {
		const vec = new Vec2D(15, 2);
		const normalized = vec.normalize();
		expect(normalized.length()).toEqual(1);
	});

	it('should return the distance with an other vector', () => {
		const vec = new Vec2D(1, 1);
		const other = new Vec2D(2, 1);
		expect(vec.distance(other)).toEqual(1);
	});
});

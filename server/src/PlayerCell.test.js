const { default: Cell } = require('./Cell');
const { default: PlayerCell } = require('./PlayerCell');
const { default: Vec2D } = require('../../common/Vec2D');

const p = new PlayerCell(3, 4, 'red', 10, 'test', 'name');
const c = new Cell(1, 1, 'red', 1);
const bigCell = new Cell(3, 3, 'red', 20);

describe('the playerCell', () => {
	test('should change the direction to 5, 6', () => {
		expect(p.dir.x).toBe(0);
		expect(p.dir.y).toBe(0);
		p.setDirection(5, 6);
		expect(p.dir.x).toBe(5);
		expect(p.dir.y).toBe(6);
	});

	test('should not be able to eat cell because too far', () => {
		expect(p.canEatCell(c)).toBe(false);
	});

	test('should not be able to eat cell because too small', () => {
		expect(p.canEatCell(bigCell)).toBe(false);
	});

	test('should be able to eat cell and return true', () => {
		c.pos = new Vec2D(3, 3);
		expect(p.canEatCell(c)).toBe(true);
	});

	test('should eat cell and get bigger', () => {
		const tpm = p.radius;
		p.eatCell(c);
		expect(p.radius).toBe(
			Math.sqrt(
				(Math.PI * Math.pow(tpm, 2) + Math.PI * Math.pow(c.radius, 2)) / Math.PI
			)
		);
	});
});

import Cell from './Cell';
import PlayerCell from './PlayerCell';
import Vec2D from '../../common/Vec2D';

const p = new PlayerCell(3, 4, 'red', 10, 'test', 'name');
const c = new Cell(1, 1, 'red', 1);
const bigCell = new Cell(3, 3, 'red', 20);

describe('the playerCell direction', () => {
	test('should change to 5, 6', () => {
		expect(p.dir.x).toBe(0);
		expect(p.dir.y).toBe(0);
		p.setDirection(5, 6);
		expect(p.dir.x).toBe(5);
		expect(p.dir.y).toBe(6);
	});
});

describe('the PlayerCell', () => {
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

describe('the playerCell score', () => {
	test('should change to 12', () => {
		expect(p.score).toBe(10);
		p.eatCell(c);
		p.updateScore();
		expect(p.score).toBe(12);
	});

	test('final score should be updated', () => {
		expect(p.finalScore).toBe(0);
		p.calculFinalScore();
		expect(p.finalScore).not.toBe(0);
	});
});

describe('the playerCell position', () => {
	test('should change', () => {
		expect(p.pos.x).toBe(3);
		expect(p.pos.y).toBe(4);
		p.move(9, 9);
		expect(p.pos.x).toBeGreaterThan(3);
		expect(p.pos.y).toBeGreaterThan(3);
	});

	test('should be back in map if out', () => {
		p.pos.x = 10;
		p.pos.y = 10;
		p.returnInMapIfIsOut(10, 10);
		expect(p.pos.x).toBeLessThan(5);
		expect(p.pos.y).toBeLessThan(5);
	});
});

describe('the playerCell speed', () => {
	test('should be reduced after eating', () => {
		let tmpSpeed = p.speed;
		p.eatCell(c);
		expect(p.speed).toBeLessThan(tmpSpeed);
	});
});

describe('the playerCell zoom', () => {
	test('should be augmented when getting bigger', () => {
		let tmpZoom = p.zoom;
		p.eatCell(c);
		p.updateZoom();
		expect(p.zoom).toBeGreaterThan(tmpZoom);
	});
});

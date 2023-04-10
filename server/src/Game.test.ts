import Game from './Game';
import fs from 'fs';
import Vec2D from '../../common/Vec2D';

let game: Game;

beforeAll(() => {
	fs.appendFileSync('gameTest.json', '[]');
});

afterAll(() => {
	fs.rmSync('gameTest.json');
});

beforeEach(() => {
	game = new Game(100, 100, 'gameTest.json');
});

describe('Food managing', () => {
	it('spawn one food on the map', () => {
		game.spawnFood();
		expect(game.foods.length).toEqual(1);
	});
	it('respawnFood restore all foods on the map', () => {
		game.respawnFood();
		expect(game.foods.length).toEqual(Game.maxFoods);
		game.foods.pop();
		expect(game.foods.length).not.toEqual(Game.maxFoods);
		game.respawnFood();
		expect(game.foods.length).toEqual(Game.maxFoods);
	});
});

describe('When receive', () => {
	describe('join event', () => {
		it('should save the new player', () => {
			game.join('socket1', 'PlayerTest', 'red');
			expect(game.players.length).toEqual(1);
		});
	});
	describe('disconnect event', () => {
		it('should kill the player', () => {
			game.join('socket1', 'PlayerTest', 'red');
			game.disconnect('socket1');
			expect(game.players.length).toEqual(0);
		});
	});
	describe('set player direction event', () => {
		it('should update the direction of the player', () => {
			game.join('socket1', 'PlayerTest', 'red');
			game.setDirection('socket1', 1, 1);
			expect(game.players[0].dir).toEqual(new Vec2D(1, 1));
		});
	});
});

describe('When update the game', () => {});

describe('top ten players', () => {});

import Game from './Game';
import fs from 'fs';
import Vec2D from '../../common/Vec2D';
import PlayerCell from './PlayerCell';

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

describe('top ten players', () => {
	it('should insert player in top ten', () => {
		const p = new PlayerCell(3, 4, 'red', 10000, 'test', 'PlayerName');
		p.calculFinalScore();
		game.insertInTopTen(p);
		expect(game.topTen[1].name).toEqual(p.name);
		expect(game.topTen[1].score).toEqual(p.finalScore);
	});
	it('should save on the file', () => {
		game.topTen.push({
			name: 'test',
			score: 100,
			date: new Date(Date.now()).getTime(),
		});
		game.saveTopTenFile();
		expect(JSON.parse(fs.readFileSync(game.topTenFile).toString())).toEqual(
			game.topTen
		);
	});
});

describe('When update the game', () => {
	it('should kill the dead players', () => {
		game.join('socket1', 'Player1', 'red');
		game.join('socket2', 'Player2', 'red');
		let p2 = game.players[1];
		game.players[0].radius = 20;
		game.players[0].pos = game.players[1].pos;
		game.players[1].vulnerable = true;
		game.update();
		expect(game.deadQueue[0]).toEqual(p2);
	});

	it('should remove p1 from palyers', () => {
		game.join('socket1', 'Player1', 'red');
		game.death(game.players[0], 0);
		expect(game.players[0]).toBeUndefined();
	});
});

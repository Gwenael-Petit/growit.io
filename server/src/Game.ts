import PlayerCell from './PlayerCell';
import FoodCell from './FoodCell';
import fs from 'fs';
import TopTenPlayer from '../../common/TopTenPlayer';

export default class Game {
	static defaultPlayerSize: number = 10;
	players: PlayerCell[] = [];
	deadQueue: PlayerCell[] = [];
	foods: FoodCell[] = [];
	width: number = 100;
	height: number = 100;
	maxFoods: number = 1000;
	topTenFile: string;
	topTen: TopTenPlayer[];

	constructor(width: number, height: number, topTenFile: string) {
		this.width = width;
		this.height = height;
		this.topTenFile = topTenFile;
		this.topTen = JSON.parse(fs.readFileSync(topTenFile).toString());
	}

	respawnFood(): void {
		const toSpawn = this.maxFoods - this.foods.length;
		for (let i = 0; i < toSpawn; i++) {
			this.spawnFood();
		}
	}

	spawnFood(): void {
		this.foods.push(
			new FoodCell(
				Math.random() * this.width - this.width / 2,
				Math.random() * this.height - this.height / 2
			)
		);
	}

	join(socketId: string, name: string, color: string): boolean {
		if (this.players.find(p => p.socketId == socketId) != undefined)
			return false;
		this.players.push(
			new PlayerCell(
				Math.random() * this.width - this.width / 2,
				Math.random() * this.height - this.height / 2,
				color,
				Game.defaultPlayerSize,
				socketId,
				name
			)
		);
		return true;
	}

	disconnect(socketId: string): void {
		for (let i = this.players.length - 1; i >= 0; i--) {
			const player = this.players[i];
			if (player.socketId == socketId) {
				this.insertInTopTen(player);
				this.players.splice(i, 1);
			}
		}
		//const idx = this.players.findIndex(player => player.socketId == socketId);
		//if (idx >= 0) this.players.splice(idx, 1);
	}

	update(): void {
		this.players.forEach(player => {
			player.update(this.width, this.height);
			for (let i = this.foods.length - 1; i >= 0; i--) {
				if (player.canEatCell(this.foods[i])) {
					this.foods.splice(i, 1);
				}
			}
		});
		for (let i = this.players.length - 1; i >= 0; i--) {
			const player = this.players[i];
			for (const other of this.players) {
				if (
					player.socketId != other.socketId &&
					player.vulnerable &&
					other.canEatCell(player)
				) {
					this.deadQueue.push(player);
					player.deathTimeStamp = new Date().getTime();
					player.score -= Game.defaultPlayerSize;
					this.insertInTopTen(player);
					this.players.splice(i, 1);
					break;
				}
			}
		}
	}

	setDirection(socketId: string, x: number, y: number): void {
		const p = this.players.find(p => p.socketId == socketId);
		if (p != undefined) p.setDirection(x, y);
	}

	insertInTopTen(player: PlayerCell): void {
		if (this.topTen.length < 9 || player.score > this.topTen[0].score) {
			this.topTen.push({
				name: player.name,
				score: player.score,
				date: new Date().getTime(),
			});
			this.topTen.sort((a, b) => {
				return a.score - b.score;
			});
			if (this.topTen.length > 10) this.topTen.shift();
			this.saveTopTenFile();
		}
	}

	saveTopTenFile(): void {
		fs.writeFileSync(this.topTenFile, JSON.stringify(this.topTen));
	}
}

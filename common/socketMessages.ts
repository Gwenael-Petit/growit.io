import Vec2D from './Vec2D';

export type PlayerJoinMessage = { name: string; color: string };
export type DirectionMessage = { socketId: string; x: number; y: number };
export type AllowConnectionMessage = { width: number; height: number };
export type UpdateGameMessage = {
	players: PlayerCellMessage[];
	foods: FoodCellMessage[];
};
export type PlayerCellMessage = {
	socketId: string;
	pos: Vec2D;
	radius: number;
	color: string;
	score: number;
	name: string;
	zoom: number;
};
export type FoodCellMessage = { pos: Vec2D; color: string; radius: number };

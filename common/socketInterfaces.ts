import {
	AllowConnectionMessage,
	UpdateGameMessage,
	DirectionMessage,
} from './socketMessages';

export interface ServerToClientsEvents {
	allowConnection: (size: AllowConnectionMessage) => void;
	joined: () => void;
	dead: () => void;
	updateGame: (game: UpdateGameMessage) => void;
}

export interface ClientToServerEvents {
	join: (name: string) => void;
	setDirection: (direction: DirectionMessage) => void;
	getLeaderboard: () => void;
}

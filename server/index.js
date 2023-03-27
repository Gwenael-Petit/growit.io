import http from 'http';
import express from 'express';
import fs from 'fs';
import addWebpackMiddleware from './addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Game from './Game.js';

const app = express();

addWebpackMiddleware(app);

const httpServer = http.createServer(app);

const io = new IOServer(httpServer);

const game = new Game(100, 100);

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);
	socket.emit('allowConnection');

	socket.on('disconnect', reason => {
		game.death(socket.id);
	});

	socket.on('join', data => {
		game.join(socket.id);
		console.log(game.players);
	});

	socket.on('getLeaderboard', () => {});

	socket.on('setDirection', data => {
		game.setDirection(data.socketId, data.x, data.y);
	});
});

app.use(express.static('client/public'));

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

setInterval(() => {
	game.update();
	io.emit('updateGame', {
		players: game.players,
		foods: game.foods,
	});
	/*game.players.forEach(player => {
		const socket = io.sockets.sockets.get(player.socketId);
		socket.emit('updateGame', {
			players: game.players,
			foods: game.foods,
		});
	});*/
}, 1000 / 60);

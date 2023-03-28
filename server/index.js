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
	socket.emit('allowConnection', {
		width: game.width,
		height: game.height,
	});

	socket.on('disconnect', reason => {
		game.remove(socket.id);
	});

	socket.on('join', data => {
		game.join(socket.id);
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
	for (let i = game.deadQueue.length - 1; i >= 0; i--) {
		io.sockets.sockets.get(game.deadQueue[i]).emit('dead');
		game.deadQueue.splice(i, 1);
	}

	io.emit('updateGame', {
		players: game.players,
		foods: game.foods,
	});
}, 1000 / 60);

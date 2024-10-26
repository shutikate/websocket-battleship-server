import { setTurn } from './setTurn';
import { Data, GameRoom, StartGameResponse } from '../types';
import { games } from '../models/games';
import { connections } from '../models/users';

export const addShips = (data: Data) => {
  const { ships, gameId, indexPlayer } = JSON.parse(data.data);

  const game = games.get(gameId);

  if (!game) {
    games.set(gameId, {
      player1: { ships, indexPlayer },
      player2: { ships: [], indexPlayer: '' },
    });
  } else {
    game.player2.ships = ships;
    game.player2.indexPlayer = indexPlayer;
    startGame(data, game);
  }
};

export const startGame = (data: Data, game: GameRoom) => {
  const response: StartGameResponse = {
    type: 'start_game',
    data: data.data,
    id: data.id,
  };

  const { indexPlayer: idPlayer1 } = game.player1;
  const { indexPlayer: idPlayer2 } = game.player2;

  const wsPlayer1 = connections.get(String(idPlayer1));
  const wsPlayer2 = connections.get(String(idPlayer2));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify(response));
    wsPlayer2.send(JSON.stringify(response));
    setTurn(idPlayer1, idPlayer2);
  }
};

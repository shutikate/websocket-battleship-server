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

  const player1WS = connections.get(String(game?.player1.indexPlayer));
  const player2WS = connections.get(String(game?.player2.indexPlayer));

  player1WS?.send(JSON.stringify(response));
  player2WS?.send(JSON.stringify(response));
};

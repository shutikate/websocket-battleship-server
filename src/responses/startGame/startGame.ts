import { setTurn } from '../attack/attackHandler';
import { Data, GameRoom } from '../../types';
import { AddShipsData, Position, StartGameResponse } from './types';
import { games } from '../../models/games';
import { connections } from '../../models/users';

export const addShips = (data: Data) => {
  const addShipsData: AddShipsData = JSON.parse(data.data);
  const { ships, gameId, indexPlayer } = addShipsData;

  const game = games.get(String(gameId));

  const positions: Position[][] = ships.map((ship) => {
    const shipPositions: Position[] = [];
    for (let i = 0; i < ship.length; i++) {
      const x = ship.position.x + (ship.direction ? 0 : i);
      const y = ship.position.y + (ship.direction ? i : 0);
      shipPositions.push({ x, y });
    }
    return shipPositions;
  });
  console.log(positions);

  if (!game) {
    games.set(String(gameId), {
      player1: { ships: positions, indexPlayer, attacks: [] },
      player2: { ships: [], indexPlayer: '', attacks: [] },
      currentPlayer: 'player1',
    });
  } else {
    game.player2.ships = positions;
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

  const wsPlayer1 = connections.get(String(game.player1.indexPlayer));
  const wsPlayer2 = connections.get(String(game.player2.indexPlayer));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify(response));
    wsPlayer2.send(JSON.stringify(response));
    setTurn(game);
  }
};

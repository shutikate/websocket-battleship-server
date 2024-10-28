import { setTurn } from '../attack/setTurn';
import { GameRoom } from '../../types';
import { AddShipsData, Position, StartGameResponse } from './types';
import { ShipsWithSurroundedCells } from './types';
import { games } from '../../models/games';
import { connections } from '../../models/users';

export const startGame = (data: string, game: GameRoom) => {
  const response: StartGameResponse = {
    type: 'start_game',
    data,
    id: 0,
  };

  const wsPlayer1 = connections.get(String(game.player1.indexPlayer));
  const wsPlayer2 = connections.get(String(game.player2.indexPlayer));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify(response));
    wsPlayer2.send(JSON.stringify(response));
    setTurn(game);
  }
};

export const addShips = (data: string) => {
  const addShipsData: AddShipsData = JSON.parse(data);
  const { ships, gameId, indexPlayer } = addShipsData;

  const game = games.get(String(gameId));

  const positionShips = new Map<string, ShipsWithSurroundedCells>();

  ships.forEach((ship, index) => {
    const shipPositions: Position[] = [];
    const surroundedCells: Position[] = [];

    for (let i = 0; i < ship.length; i++) {
      const x = ship.position.x + (ship.direction ? 0 : i);
      const y = ship.position.y + (ship.direction ? i : 0);
      shipPositions.push({ x, y });

      if (x - 1 >= 0) surroundedCells.push({ x: x - 1, y });
      if (x - 1 >= 0 && y - 1 >= 0) surroundedCells.push({ x: x - 1, y: y - 1 });
      if (x - 1 >= 0 && y + 1 <= 9) surroundedCells.push({ x: x - 1, y: y + 1 });
      if (x + 1 <= 9) surroundedCells.push({ x: x + 1, y });
      if (x + 1 <= 9 && y - 1 >= 0) surroundedCells.push({ x: x + 1, y: y - 1 });
      if (x + 1 <= 9 && y + 1 <= 9) surroundedCells.push({ x: x + 1, y: y + 1 });
      if (y - 1 >= 0) surroundedCells.push({ x, y: y - 1 });
      if (y + 1 <= 9) surroundedCells.push({ x, y: y + 1 });
    }

    const filteredSurroundedCells = surroundedCells.filter(
      (cell) => !shipPositions.some((pos) => pos.x === cell.x && pos.y === cell.y)
    );

    positionShips.set(String(index), { shipPositions, surroundedCells: filteredSurroundedCells });
  });

  if (!game) {
    games.set(String(gameId), {
      player1: { ships: positionShips, indexPlayer, attacks: [] },
      player2: { ships: new Map(), indexPlayer: '', attacks: [] },
      currentPlayer: 'player1',
    });
  } else {
    game.player2.ships = positionShips;
    game.player2.indexPlayer = indexPlayer;
    startGame(data, game);
  }
};

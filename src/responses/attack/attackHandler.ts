import { connections } from '../../models/users';
import { games } from '../../models/games';
import { Data, GameRoom } from '../../types';
import { AttackData, AttackFeedback, Turn } from './types';

export const setTurn = (game: GameRoom) => {
  const currentPlayer = game.currentPlayer;
  const currentPlayerIndex = game[currentPlayer].indexPlayer;

  const response: Turn = {
    type: 'turn',
    data: { currentPlayer: currentPlayerIndex },
  };

  const wsPlayer1 = connections.get(String(game.player1.indexPlayer));
  const wsPlayer2 = connections.get(String(game.player2.indexPlayer));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
    wsPlayer2.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  }
};

export const getAttackStatus = (attackShip: { x: number; y: number }[] | undefined) => {
  if (!attackShip) {
    return 'miss';
  }
  if (attackShip.length === 1) {
    return 'killed';
  }
  return 'shot';
};

export const createAttackFeedback = (
  attackData: AttackData,
  game: GameRoom,
  id: number,
  status: 'miss' | 'killed' | 'shot'
) => {
  const { x, y, indexPlayer } = attackData;
  const response: AttackFeedback = {
    type: 'attack',
    data: {
      position: { x, y },
      currentPlayer: indexPlayer,
      status: status,
    },
    id,
  };

  const wsPlayer1 = connections.get(String(game.player1.indexPlayer));
  const wsPlayer2 = connections.get(String(game.player2.indexPlayer));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
    wsPlayer2.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  }
};

export const attackHandler = (data: Data) => {
  const attackData: AttackData = JSON.parse(data.data);
  const { gameId, x, y, indexPlayer } = attackData;

  const game = games.get(String(gameId));

  if (!game) {
    console.error('Game not found');
    return;
  }

  const attackPlayer = game.player1.indexPlayer === indexPlayer ? 'player1' : 'player2';
  const defendPlayer = game.player1.indexPlayer === indexPlayer ? 'player2' : 'player1';

  if (game.currentPlayer !== attackPlayer) {
    console.error('Not your turn');
    return;
  }

  const isShotExists = game[attackPlayer].attacks.some((attack) => attack.x === x && attack.y === y);

  if (isShotExists) {
    console.error('This shot already done');
    return;
  }

  game[attackPlayer].attacks.push({ x, y });

  const defenderShips = game[defendPlayer].ships;
  const attackShip = defenderShips.find((ship) => ship.some((position) => position.x === x && position.y === y));

  const status = getAttackStatus(attackShip);

  createAttackFeedback(attackData, game, data.id, status);

  if (attackShip) {
    game[defendPlayer].ships = defenderShips.map((ship) =>
      ship.filter((position) => position.x !== x || position.y !== y)
    );
  } else {
    const nextPlayer = game.currentPlayer === 'player1' ? 'player2' : 'player1';
    game.currentPlayer = nextPlayer;
    setTurn(game);
  }
};

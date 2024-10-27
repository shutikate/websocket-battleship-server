import { setTurn } from './setTurn';
import { createAttackFeedback } from './createAttackFeedback';
import { games } from '../../models/games';
import { AttackData } from './types';

export const getAttackStatus = (attackShip: { x: number; y: number }[] | undefined) => {
  if (!attackShip) {
    return 'miss';
  }
  if (attackShip.length === 1) {
    return 'killed';
  }
  return 'shot';
};

export const attackHandler = (data: string) => {
  const attackData: AttackData = JSON.parse(data);
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

  createAttackFeedback(attackData, game, status);

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

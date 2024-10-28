import { setTurn } from './setTurn';
import { createAttackFeedback } from './createAttackFeedback';
import { games } from '../../models/games';
import { AttackData } from './types';
import { ShipsWithSurroundedCells } from '../startGame/types';
import { finishGame } from '../finishGame/finishGame';
import { returnWinners } from '../winners/winners';

export const getAttackStatus = (defenderShip: ShipsWithSurroundedCells | undefined) => {
  if (!defenderShip) {
    return 'miss';
  }
  if (defenderShip.shipPositions.length === 1) {
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
  const defenderPlayer = game.player1.indexPlayer === indexPlayer ? 'player2' : 'player1';

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

  const defenderShips = Array.from(game[defenderPlayer].ships.values());
  const defenderShip = defenderShips.find((ship) =>
    ship.shipPositions.some((position) => position.x === x && position.y === y)
  );

  const status = getAttackStatus(defenderShip);

  createAttackFeedback(attackData, defenderShip, game, status);

  if (defenderShip) {
    defenderShip.shipPositions = defenderShip.shipPositions.filter((position) => position.x !== x || position.y !== y);

    const remainingShips = defenderShips.filter((ship) => ship.shipPositions.length > 0);

    if (remainingShips.length === 0) {
      const winPlayerIndex = String(game[attackPlayer].indexPlayer);
      const defenderPlayerIndex = game[defenderPlayer].indexPlayer;
      finishGame(winPlayerIndex, defenderPlayerIndex);
      returnWinners();
    }
  } else {
    const nextPlayer = game.currentPlayer === 'player1' ? 'player2' : 'player1';
    game.currentPlayer = nextPlayer;
    setTurn(game);
  }
};

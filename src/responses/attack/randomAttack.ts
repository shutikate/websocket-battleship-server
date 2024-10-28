import { attackHandler } from './attackHandler';
import { games } from '../../models/games';
import { RandomAttackData } from './types';

const setRandomCoordinates = () => {
  return {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };
};

export const randomAttack = (data: string) => {
  const attackData: RandomAttackData = JSON.parse(data);
  const { gameId, indexPlayer } = attackData;

  const { x, y } = setRandomCoordinates();

  const game = games.get(String(gameId));

  if (!game) {
    console.error('Game not found');
    return;
  }

  const currentPlayer = game?.currentPlayer;
  const isInvalidAttack = game[currentPlayer].attacks.some((attack) => attack.x === x && attack.y === y);

  if (isInvalidAttack) {
    randomAttack(data);
    return;
  }

  attackHandler(JSON.stringify({ gameId, x, y, indexPlayer }));
};

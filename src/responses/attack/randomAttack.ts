import { attackHandler } from './attackHandler';
import { games } from '../../models/games';
import { RandomAttackData } from './types';
import { Data } from '../../types';

const setRandomCoordinates = () => {
  return {
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10),
  };
};

export const randomAttack = (data: Data) => {
  const attackData: RandomAttackData = JSON.parse(data.data);
  const { gameId, indexPlayer } = attackData;

  const { x, y } = setRandomCoordinates();
  console.log(x, y);

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

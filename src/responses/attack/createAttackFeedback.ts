import { GameRoom } from '../../types';
import { AttackData, AttackFeedback } from './types';
import { ShipsWithSurroundedCells } from '../startGame/types';
import { connections } from '../../models/users';

export const createAttackFeedback = (
  attackData: AttackData,
  defenderShip: ShipsWithSurroundedCells | undefined,
  game: GameRoom,
  status: 'miss' | 'killed' | 'shot'
) => {
  const { x, y, indexPlayer } = attackData;

  const response = (
    x: number,
    y: number,
    indexPlayer: number | string,
    status: 'miss' | 'killed' | 'shot'
  ): AttackFeedback => {
    return {
      type: 'attack',
      data: {
        position: { x, y },
        currentPlayer: indexPlayer,
        status: status,
      },
      id: 0,
    };
  };

  const surroundedCells = defenderShip?.surroundedCells;

  const wsPlayer1 = connections.get(String(game.player1.indexPlayer));
  const wsPlayer2 = connections.get(String(game.player2.indexPlayer));

  if (status === 'killed' && surroundedCells) {
    surroundedCells.forEach((cell) => {
      const res = response(cell.x, cell.y, indexPlayer, 'miss');
      wsPlayer1?.send(JSON.stringify({ ...res, data: JSON.stringify(res.data) }));
      wsPlayer2?.send(JSON.stringify({ ...res, data: JSON.stringify(res.data) }));
    });
  }

  const res = response(x, y, indexPlayer, status);
  wsPlayer1?.send(JSON.stringify({ ...res, data: JSON.stringify(res.data) }));
  wsPlayer2?.send(JSON.stringify({ ...res, data: JSON.stringify(res.data) }));
};

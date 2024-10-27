import { GameRoom } from '../../types';
import { AttackData, AttackFeedback } from './types';
import { connections } from '../../models/users';

export const createAttackFeedback = (attackData: AttackData, game: GameRoom, status: 'miss' | 'killed' | 'shot') => {
  const { x, y, indexPlayer } = attackData;
  const response: AttackFeedback = {
    type: 'attack',
    data: {
      position: { x, y },
      currentPlayer: indexPlayer,
      status: status,
    },
    id: 0,
  };

  const wsPlayer1 = connections.get(String(game.player1.indexPlayer));
  const wsPlayer2 = connections.get(String(game.player2.indexPlayer));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
    wsPlayer2.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  }
};

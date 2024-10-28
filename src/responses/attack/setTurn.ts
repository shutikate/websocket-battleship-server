import { GameRoom } from '../../types';
import { Turn } from './types';
import { connections } from '../../models/users';

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

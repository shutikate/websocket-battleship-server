import { connections, players } from '../../models/users';
import { updateWinners } from '../winners/winners';

export const finishGame = (winPlayerIndex: string, defenderPlayerIndex: string | number) => {
  const response = {
    type: 'finish',
    data: {
      winPlayer: winPlayerIndex,
    },
    id: 0,
  };

  const winnerName = players.get(String(winPlayerIndex))?.name;

  if (winnerName) updateWinners(winnerName, winPlayerIndex);

  const wsPlayer1 = connections.get(String(winPlayerIndex));
  const wsPlayer2 = connections.get(String(defenderPlayerIndex));

  wsPlayer1?.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  wsPlayer2?.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
};

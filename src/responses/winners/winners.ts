import { UpdateWinnersResponse } from './types';
import { winners, connections } from '../../models/users';

export const updateWinners = (winnerName: string, winnerIndex: string) => {
  if (winners.has(winnerIndex)) {
    const winner = winners.get(winnerIndex);
    if (winner) {
      winners.set(winnerIndex, { name: winner.name, wins: winner.wins + 1 });
    }
  } else {
    winners.set(winnerIndex, { name: winnerName, wins: 1 });
  }
};

export const returnWinners = () => {
  const response: UpdateWinnersResponse = {
    type: 'update_winners',
    data: Array.from(winners.values()).map(({ name, wins }) => ({ name, wins })),
    id: 0,
  };

  connections.values().forEach((connection) => {
    connection.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  });
};

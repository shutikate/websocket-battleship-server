import { UpdateWinnersResponse, Data, User } from '../types';
import { winners, connections } from '../models/users';

export const updateWinners = (data: Data, id: string) => {
  const user: User = JSON.parse(data.data);
  if (winners.has(id)) {
    const winner = winners.get(id);
    if (winner) {
      winners.set(id, { name: winner.name, wins: winner.wins + 1 });
    }
  } else {
    winners.set(id, { name: user.name, wins: 1 });
  }
};

export const returnWinners = (data: Data) => {
  const response: UpdateWinnersResponse = {
    type: 'update_winners',
    data: Array.from(winners.values()).map(({ name, wins }) => ({ name, wins })),
    id: data.id,
  };
  connections.values().forEach((connection) => {
    connection.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  });
};

import { WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { returnWinners } from './winners';
import { Data, RegistrationResponse, User } from '../types';
import { players } from '../users/users';

export const registration = (data: Data, ws: WebSocket) => {
  const user: User = JSON.parse(data.data);
  const response: RegistrationResponse = {
    type: data.type,
    data: {
      name: user.name,
      index: '',
      error: false,
      errorText: '',
    },
    id: data.id,
  };

  if (players.size === 0) {
    const id = randomUUID();
    players.set(id, { ...user, index: id });
    ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: id }) }));
    returnWinners(data, ws);
    return;
  }

  for (const player of players.values()) {
    if (player.name === user.name) {
      if (player.password === user.password) {
        ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: player.index }) }));
        returnWinners(data, ws);
      } else {
        ws.send(
          JSON.stringify({
            ...response,
            data: JSON.stringify({
              ...response.data,
              index: player.index,
              error: true,
              errorText: 'Password is incorrect',
            }),
          })
        );
      }
    } else {
      const id = randomUUID();
      players.set(id, { ...user, index: id });
      ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: id }) }));
      returnWinners(data, ws);
    }
  }
};

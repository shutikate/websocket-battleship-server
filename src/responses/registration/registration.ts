import { WebSocket } from 'ws';
import { returnWinners } from '../winners/winners';
import { returnRooms } from '../updateRoom/updateRoom';
import { Data } from '../../types';
import { User, RegistrationResponse } from './types';
import { players, connections } from '../../models/users';

export const registration = (data: Data, ws: WebSocket, userID: string) => {
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
    players.set(userID, { ...user, index: userID });
    connections.set(userID, ws);
    ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: userID }) }));
    returnWinners(data);
    returnRooms(data.id);
    return;
  }

  for (const player of players.values()) {
    if (player.name === user.name) {
      if (player.password === user.password) {
        ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: player.index }) }));
        returnWinners(data);
        returnRooms(data.id);
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
        return;
      }
    }
  }

  players.set(userID, { ...user, index: userID });
  connections.set(userID, ws);
  ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: userID }) }));
  returnWinners(data);
  returnRooms(data.id);
};

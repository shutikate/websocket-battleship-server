import { WebSocket } from 'ws';
import { returnWinners } from './winners';
import { returnRooms } from './updateRoom';
import { Data, RegistrationResponse, User } from '../types';
import { players } from '../models/users';

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
    ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: userID }) }));
    returnWinners(data);
    returnRooms(data);
    return;
  }

  for (const player of players.values()) {
    if (player.name === user.name) {
      if (player.password === user.password) {
        ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: player.index }) }));
        returnWinners(data);
        returnRooms(data);
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
  ws.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, index: userID }) }));
  returnWinners(data);
  returnRooms(data);
};

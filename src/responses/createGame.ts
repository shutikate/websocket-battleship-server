import { randomUUID } from 'node:crypto';
import { Data, StartGame } from '../types';
import { rooms } from '../models/rooms';
import { connections } from '../models/users';

export const createGame = (data: Data, roomID: string) => {
  const idGame = randomUUID();

  const room = rooms.get(roomID);
  const users = room?.roomUsers;

  const response: StartGame = {
    type: 'create_game',
    data: { idGame, idPlayer: '' },
    id: data.id,
  };

  users?.forEach((user) => {
    const connection = connections.get(String(user.index));
    connection?.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, idPlayer: user.index }) }));
  });
};

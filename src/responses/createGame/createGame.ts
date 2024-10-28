import { randomUUID } from 'node:crypto';
import { CreateGame } from '../createGame/types';
import { rooms } from '../../models/rooms';
import { connections } from '../../models/users';

export const createGame = (roomID: string) => {
  const idGame = randomUUID();

  const room = rooms.get(roomID);
  const users = room?.roomUsers;

  const response: CreateGame = {
    type: 'create_game',
    data: { idGame, idPlayer: '' },
    id: 0,
  };

  users?.forEach((user) => {
    const connection = connections.get(String(user.index));
    connection?.send(JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, idPlayer: user.index }) }));
  });
};

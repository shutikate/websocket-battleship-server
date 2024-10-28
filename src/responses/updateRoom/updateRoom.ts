import { randomUUID } from 'node:crypto';
import { createGame } from '../createGame/createGame';
import { players, connections } from '../../models/users';
import { rooms } from '../../models/rooms';
import { IndexRoom } from './types';

export const returnRooms = () => {
  const response = {
    type: 'update_room',
    data: Array.from(rooms.values()),
    id: 0,
  };

  connections.values().forEach((connection) => {
    connection.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  });
};

export const createRoom = (userID: string) => {
  const roomId = randomUUID();
  const player = players.get(userID);
  if (player) {
    rooms.set(roomId, { roomId, roomUsers: [{ name: player.name, index: player.index }] });
  }
  returnRooms();
};

export const updateRoom = (data: string, userID: string) => {
  const updateRoomData: IndexRoom = JSON.parse(data);

  const { indexRoom } = updateRoomData;
  const room = rooms.get(indexRoom);
  const player = players.get(userID);

  if (room && player) {
    const isPlayerInRoom = room.roomUsers.some((user) => user.index === player.index);

    if (isPlayerInRoom) {
      const ws = connections.get(userID);
      if (ws) {
        ws.send(
          JSON.stringify({
            type: 'error',
            data: 'User is already in the room',
            id: 0,
          })
        );
      }
      return;
    }

    room.roomUsers.push({ name: player.name, index: player.index });
  }

  createGame(indexRoom);
  rooms.delete(indexRoom);
  returnRooms();
};

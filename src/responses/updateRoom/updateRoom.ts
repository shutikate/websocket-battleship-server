import { randomUUID } from 'node:crypto';
import { createGame } from '../createGame/createGame';
import { players, connections } from '../../models/users';
import { rooms } from '../../models/rooms';
import { Data } from '../../types';
import { IndexRoom } from './types';

export const updateRoom = (data: Data, userID: string) => {
  const updateRoomData: IndexRoom = JSON.parse(data.data);

  const { indexRoom } = updateRoomData;
  const room = rooms.get(indexRoom);
  const player = players.get(userID);
  if (room && player) {
    room.roomUsers.push({ name: player.name, index: player.index });
  }
  createGame(data, indexRoom);
  rooms.delete(indexRoom);
  returnRooms(data.id);
};

export const createRoom = (data: Data, userID: string) => {
  const roomId = randomUUID();
  const player = players.get(userID);
  if (player) {
    rooms.set(roomId, { roomId, roomUsers: [{ name: player.name, index: player.index }] });
  }
  returnRooms(data.id);
};

export const returnRooms = (id: number) => {
  const response = {
    type: 'update_room',
    data: Array.from(rooms.values()),
    id,
  };

  connections.values().forEach((connection) => {
    connection.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  });
};

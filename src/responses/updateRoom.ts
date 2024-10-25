import { randomUUID } from 'node:crypto';
import { createGame } from './createGame';
import { players, connections } from '../models/users';
import { rooms } from '../models/rooms';
import { Data } from '../types';

export const updateRoom = (data: Data, userID: string) => {
  const roomId = JSON.parse(data.data).indexRoom;
  const room = rooms.get(roomId);
  const player = players.get(userID);
  if (room && player) {
    room.roomUsers.push({ name: player.name, index: player.index });
  }
  returnRooms(data);
  createGame(data, roomId);
  rooms.delete(roomId);
};

export const createRoom = (data: Data, userID: string) => {
  const roomId = randomUUID();
  const player = players.get(userID);
  if (player) {
    rooms.set(roomId, { roomId, roomUsers: [{ name: player.name, index: player.index }] });
  }
  returnRooms(data);
};

export const returnRooms = (data: Data) => {
  const response = {
    type: 'update_room',
    data: Array.from(rooms.values()),
    id: data.id,
  };

  connections.values().forEach((connection) => {
    connection.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
  });
};

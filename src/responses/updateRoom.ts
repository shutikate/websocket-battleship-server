import WebSocket from 'ws';
import { randomUUID } from 'node:crypto';
import { rooms, players } from '../users/users';
import { Data } from '../types';

export const updateRoom = (data: Data, ws: WebSocket, userID: string) => {
  const roomId = JSON.parse(data.data).indexRoom;
  const room = rooms.get(roomId);
  const player = players.get(userID);
  if (room && player) {
    room.roomUsers.push({ name: player.name, index: player.index });
  }
  returnRooms(data, ws);
};

export const createRoom = (data: Data, ws: WebSocket, userID: string) => {
  const roomId = randomUUID();
  const player = players.get(userID);
  if (player) {
    rooms.set(roomId, { roomId, roomUsers: [{ name: player.name, index: player.index }] });
  }
  returnRooms(data, ws);
};

export const returnRooms = (data: Data, ws: WebSocket) => {
  const response = {
    type: 'update_room',
    data: Array.from(rooms.values()),
    id: data.id,
  };

  ws.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
};

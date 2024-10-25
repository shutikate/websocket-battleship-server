import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import { registration } from '../responses/registration';
import { createRoom, updateRoom } from '../responses/updateRoom';
import { connections } from '../models/users';
import { Data } from '../types';

export const createWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    const userID = randomUUID();
    connections.set(userID, ws);

    ws.on('error', console.error);
    connections.set(userID, ws);

    ws.on('message', (message) => {
      try {
        const messageToString = message.toString();
        const data: Data = JSON.parse(messageToString);
        if (data.type === 'reg') {
          registration(data, ws, userID);
        }
        if (data.type === 'create_room') {
          createRoom(data, userID);
        }
        if (data.type === 'add_user_to_room') {
          updateRoom(data, userID);
        }
      } catch {
        ws.send(JSON.stringify({ error: 'Request is invalid' }));
      }
    });

    const connectionInfo = {
      message: `WebSocket server started on ws://localhost:${port}`,
      date: new Date().toISOString(),
    };

    ws.send(JSON.stringify(connectionInfo));
  });

  wss.on('close', () => {
    console.log('WebSocket connection closed');
  });

  process.on('SIGINT', () => {
    wss.close();
  });

  console.log(`WebSocket server started on ws://localhost:${port}`);
};

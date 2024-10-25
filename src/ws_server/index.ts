import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import { registration } from '../responses/registration';
import { createRoom, updateRoom } from '../responses/updateRoom';
import { Data } from '../types';

export const createWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
      const userID = randomUUID();
      try {
        const messageToString = message.toString();
        const data: Data = JSON.parse(messageToString);
        if (data.type === 'reg') {
          registration(data, ws, userID);
        }
        if (data.type === 'create_room') {
          createRoom(data, ws, userID);
        }
        if (data.type === 'add_user_to_room') {
          updateRoom(data, ws, userID);
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

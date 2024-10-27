import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';
import { registration } from '../responses/registration/registration';
import { createRoom, updateRoom } from '../responses/updateRoom/updateRoom';
import { addShips } from '../responses/startGame/startGame';
import { Data } from '../types';
import { attackHandler } from '../responses/attack/attackHandler';
import { randomAttack } from '../responses/attack/randomAttack';

export const createWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    const userID = randomUUID();

    ws.on('error', console.error);

    ws.on('message', (message) => {
      try {
        const data: Data = JSON.parse(message.toString());
        if (data.type === 'reg') {
          registration(data, ws, userID);
        }
        if (data.type === 'create_room') {
          createRoom(data, userID);
        }
        if (data.type === 'add_user_to_room') {
          updateRoom(data, userID);
        }
        if (data.type === 'add_ships') {
          addShips(data);
        }
        if (data.type === 'attack') {
          attackHandler(data.data);
        }
        if (data.type === 'randomAttack') {
          randomAttack(data);
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

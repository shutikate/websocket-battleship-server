import { WebSocketServer } from 'ws';
import { registration } from '../responses/registration';
import { Data } from '../types';

export const createWebSocketServer = (port: number) => {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('error', console.error);

    ws.on('message', (message) => {
      try {
        const messageToString = message.toString();
        const data: Data = JSON.parse(messageToString);
        console.log(data);
        if (data.type === 'reg') {
          registration(data, ws);
        }
      } catch (error) {
        console.error(error);
        ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });

    const connectionInfo = {
      message: 'New WebSocket connection',
      date: new Date().toISOString(),
    };

    ws.send(JSON.stringify(connectionInfo));
  });

  console.log(`WebSocket server started on ws://localhost:${port}`);
};

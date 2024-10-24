import { readFile } from 'node:fs';
import { resolve, dirname } from 'node:path';
import http from 'node:http';
// import { WebSocketServer } from 'ws';

export const server = http.createServer((req, res) => {
  const __dirname = resolve(dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

// const wsPort = 8182;

// const wss = new WebSocketServer({ port: wsPort });

// wss.on('connection', function connection(ws) {
//   console.log('New WebSocket connection');
//   ws.on('error', console.error);

//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);
//     ws.send(`Server received: ${message}`);
//   });

//   ws.send('Welcome to the WebSocket server!');
// });
// console.log(`WebSocket server started on ws://localhost:${wsPort}`);

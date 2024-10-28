import { server } from './src/http_server';
import { createWebSocketServer } from './src/ws_server';

const HTTP_PORT = 8181;
const WS_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
server.listen(HTTP_PORT);
createWebSocketServer(WS_PORT);

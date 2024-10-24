import { WebSocket } from 'ws';
import { Data, RegistrationResponse, User } from '../types';

export const registration = (data: Data, ws: WebSocket) => {
  const user: User = JSON.parse(data.data);
  const response: RegistrationResponse = {
    type: data.type,
    data: {
      name: user.name,
      index: '123',
      error: false,
      errorText: '',
    },
    id: data.id,
  };
  ws.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
};

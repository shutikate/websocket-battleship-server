import { connections } from '../models/users';

let turn = 1;

export const setTurn = (idPlayer1: string | number, idPlayer2: string | number) => {
  const response = {
    type: 'turn',
    data: JSON.stringify({ currentPlayer: turn === 1 ? idPlayer1 : idPlayer2 }),
  };

  const wsPlayer1 = connections.get(String(idPlayer1));
  const wsPlayer2 = connections.get(String(idPlayer2));

  if (wsPlayer1 && wsPlayer2) {
    wsPlayer1.send(JSON.stringify(response));
    wsPlayer2.send(JSON.stringify(response));
  }

  turn = turn === 1 ? 2 : 1;
};

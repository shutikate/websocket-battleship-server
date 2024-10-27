export interface Data {
  type: string;
  data: string;
  id: number;
}

export interface Player {
  name: string;
  password: string;
  index: number | string;
}

export interface Winner {
  name: string;
  wins: number;
}

export interface Room {
  roomId: number | string;
  roomUsers: {
    name: string;
    index: number | string;
  }[];
}

export interface GameRoom {
  player1: {
    ships: { x: number; y: number }[][];
    indexPlayer: number | string;
    attacks: { x: number; y: number }[];
  };
  player2: {
    ships: { x: number; y: number }[][];
    indexPlayer: number | string;
    attacks: { x: number; y: number }[];
  };
  currentPlayer: 'player1' | 'player2';
}

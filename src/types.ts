export interface User {
  name: string;
  password: string;
}

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

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
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

export interface RegistrationResponse {
  type: string;
  data: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export interface UpdateWinnersResponse {
  type: string;
  data: {
    name: string;
    wins: number;
  }[];
  id: number;
}

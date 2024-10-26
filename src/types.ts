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

export interface StartGame {
  type: string;
  data: {
    idGame: number | string;
    idPlayer: number | string;
  };
  id: number;
}

export interface Ship {
  position: string;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface GameRoom {
  player1: {
    ships: Ship[];
    indexPlayer: number | string;
  };
  player2: {
    ships: Ship[];
    indexPlayer: number | string;
  };
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

export interface StartGameResponse {
  type: string;
  data: string;
  id: number;
}

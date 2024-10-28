import { ShipsWithSurroundedCells } from './responses/startGame/types';

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
  shipPositions: { x: number; y: number }[];
  surroundedCells: { x: number; y: number }[];
}

export interface GameRoom {
  player1: {
    ships: Map<string, ShipsWithSurroundedCells>;
    indexPlayer: number | string;
    attacks: { x: number; y: number }[];
  };
  player2: {
    ships: Map<string, ShipsWithSurroundedCells>;
    indexPlayer: number | string;
    attacks: { x: number; y: number }[];
  };
  currentPlayer: 'player1' | 'player2';
}

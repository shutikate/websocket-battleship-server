import { Position } from '../startGame/types';

export interface AttackData {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
}

export interface AttackFeedback {
  type: string;
  data: {
    position: Position;
    currentPlayer: number | string;
    status: 'miss' | 'killed' | 'shot';
  };
  id: number;
}

export interface Turn {
  type: string;
  data: {
    currentPlayer: number | string;
  };
}

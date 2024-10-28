export interface Position {
  x: number;
  y: number;
}

export interface ShipsWithSurroundedCells {
  shipPositions: Position[];
  surroundedCells: Position[];
}

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface AddShipsData {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
}

export interface StartGameResponse {
  type: string;
  data: string;
  id: number;
}

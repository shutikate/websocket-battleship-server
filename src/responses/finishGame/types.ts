export interface FinishResponse {
  type: string;
  data: {
    winPlayer: string | number;
  };
  id: number;
}

export interface CreateGame {
  type: string;
  data: {
    idGame: number | string;
    idPlayer: number | string;
  };
  id: number;
}

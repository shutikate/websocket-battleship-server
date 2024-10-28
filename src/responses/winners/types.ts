export interface UpdateWinnersResponse {
  type: string;
  data: {
    name: string;
    wins: number;
  }[];
  id: number;
}

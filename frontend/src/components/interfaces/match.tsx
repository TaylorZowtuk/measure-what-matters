export type MatchDTO = {
  matchId: number;
  teamId: number;
  startTime: number;
  isHomeTeam: boolean;
  halfTime: number | null;
  fullTime: number | null;
  createdDate: number;
  updatedDate: number;
};

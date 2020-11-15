import { TeamDTO } from "./team";

export type MatchDTO = {
  matchId: number;
  team: TeamDTO | null;
  teamId: number;
  scheduledTime: number;
  startTime: number | null;
  halfTime: number | null;
  fullTime: number | null;
  opponentTeamName: string;
  isHomeTeam: boolean;
  createdDate: string;
  updatedDate: string;
};

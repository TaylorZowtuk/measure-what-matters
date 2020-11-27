import Player from "../player";

interface RecordingProps {
  matchId: string;
  teamId: string;
  startingLineup: Player[];
  ourTeamName: string;
  oppTeamName: string;
}

export default RecordingProps;

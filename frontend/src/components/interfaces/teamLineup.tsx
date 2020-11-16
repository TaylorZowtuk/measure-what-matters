interface TeamLineup {
  team: string;
  teamId: number;
  matchList: {
    id: number;
    goalList: {
      lineup: number[];
    }[];
  }[];
}

export default TeamLineup;

interface Player {
  firstName: string;
  lastName: string;
  jerseyNum: number; // Jersey number
  teamId: number; // Unique team id from the db
  playerId: number; // Unique player id from the db
}

export default Player;

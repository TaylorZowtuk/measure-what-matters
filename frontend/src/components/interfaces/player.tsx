interface Player {
  playerId: number; // Unique player id from the db
  teamId: number; // Unique team id from the db
  firstName: string;
  lastName: string;
  jerseyNum: number; // Jersey number
}

export default Player;

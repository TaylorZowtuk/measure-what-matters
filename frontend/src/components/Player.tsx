import React from "react";
import { useDrag } from "react-dnd";
import { DraggableTypes } from "../constants";
import { Button } from "react-bootstrap";

type Player = {
  firstName: string;
  lastName: string;
  num: number; // Jersey number
  team: string;
  playerId: number; // Unique player id from the db
};

export const PlayerDraggable: React.FC<Player> = ({
  firstName,
  lastName,
  num,
  team,
  playerId,
}) => {
  const player: Player = {
    firstName: firstName,
    lastName: lastName,
    num: num,
    team: team,
    playerId: playerId,
  };
  const [, drag] = useDrag({
    item: { type: DraggableTypes.PLAYER, player },
  });

  if (team === "ours") {
    return (
      <Button ref={drag} variant="dark">
        {num} {firstName} {lastName}
      </Button>
    );
  } else {
    // If team is "theirs"
    return (
      <Button ref={drag} variant="danger">
        Opposition
      </Button>
    );
  }
};

export function createPlayerDraggable(players: Player[]): any[] {
  let playerDraggables: any[] = [];
  // For each Player in the players array, create a PlayerDraggable jsx element
  for (var i = 0; i < players.length; i++) {
    playerDraggables.push(
      <PlayerDraggable
        firstName={players[i].firstName}
        lastName={players[i].lastName}
        num={players[i].num}
        team="ours"
        playerId={players[i].playerId}
      />
    );
  }

  return playerDraggables;
}

export default Player;

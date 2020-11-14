import React from "react";
import { useDrag } from "react-dnd";
import { DraggableTypes } from "../constants";
import { Button } from "react-bootstrap";
import Player from "./interfaces/player";

export const PlayerDraggable: React.FC<Player> = ({
  firstName: first_name,
  lastName: last_name,
  jerseyNum: num,
  teamId: team,
  playerId,
}) => {
  const player: Player = {
    firstName: first_name,
    lastName: last_name,
    jerseyNum: num,
    teamId: team,
    playerId: playerId,
  };
  const [, drag] = useDrag({
    item: { type: DraggableTypes.PLAYER, player },
  });

  if (team === "ours") {
    return (
      <Button ref={drag} variant="dark">
        {num} {first_name} {last_name}
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
        jerseyNum={players[i].jerseyNum}
        teamId="ours"
        playerId={players[i].playerId}
      />
    );
  }

  return playerDraggables;
}

export default Player;

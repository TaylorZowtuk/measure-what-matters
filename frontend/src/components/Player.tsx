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

type Possesion = {
  hasPossesion: boolean; // Whether or not the the player has possesion of the ball
};

type DraggableProps = {
  player: Player;
  possesion: Possesion;
};

export const PlayerDraggable = (props: DraggableProps) => {
  const player: Player = {
    firstName: props.player.firstName,
    lastName: props.player.lastName,
    num: props.player.num,
    team: props.player.team,
    playerId: props.player.playerId,
  };

  const [, drag] = useDrag({
    item: { type: DraggableTypes.PLAYER, player },
  });

  console.log(props.possesion.hasPossesion);

  if (player.team === "ours") {
    if (props.possesion.hasPossesion) {
      return (
        <Button ref={drag} variant="outline-dark">
          {player.num} {player.firstName} {player.lastName}
        </Button>
      );
    } else {
      return (
        <Button ref={drag} variant="dark">
          {player.num} {player.firstName} {player.lastName}
        </Button>
      );
    }
  } else {
    // If team is "theirs"
    if (props.possesion.hasPossesion) {
      return (
        <Button ref={drag} variant="outline-danger">
          Opposition
        </Button>
      );
    } else {
      return (
        // Because we dont need to allow the opposition to make shift changes,
        // only allow opposing team to be dragged when they have the ball
        <Button variant="danger">Opposition</Button>
      );
    }
  }
};

export function createPlayerDraggable(players: Player[]): any[] {
  let playerDraggables: any[] = [];
  // For each Player in the players array, create a PlayerDraggable jsx element
  for (var i = 0; i < players.length; i++) {
    const player: Player = {
      firstName: players[i].firstName,
      lastName: players[i].lastName,
      num: players[i].num,
      team: players[i].team,
      playerId: players[i].playerId,
    };
    const possesion: Possesion = {
      hasPossesion: false,
    };

    playerDraggables.push(
      <PlayerDraggable player={player} possesion={possesion} />
    );
  }

  return playerDraggables;
}

export default Player;

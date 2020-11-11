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

type Possession = {
  hasPossession: boolean; // Whether or not the the player has possession of the ball
  notifyOfPossessionChange: Function; // A callback to notify Field of possession change
};

type DraggableProps = {
  player: Player;
  possession: Possession;
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

  if (player.team === "ours") {
    if (props.possession.hasPossession) {
      return (
        <Button ref={drag} variant="outline-dark">
          {player.num} {player.firstName} {player.lastName}
        </Button>
      );
    } else {
      return (
        <Button
          ref={drag}
          variant="dark"
          onClick={() =>
            changePossession(
              player.playerId,
              props.possession.notifyOfPossessionChange
            )
          }
        >
          {player.num} {player.firstName} {player.lastName}
        </Button>
      );
    }
  } else {
    // If team is "theirs"
    if (props.possession.hasPossession) {
      return (
        <Button ref={drag} variant="outline-danger">
          Opposition
        </Button>
      );
    } else {
      return (
        // Because we dont need to allow the opposition to make shift changes,
        // only allow opposing team to be dragged when they have the ball
        <Button
          variant="danger"
          onClick={() =>
            changePossession(
              player.playerId,
              props.possession.notifyOfPossessionChange
            )
          }
        >
          Opposition
        </Button>
      );
    }
  }
};

function changePossession(
  playerId: number,
  notifyOfPossessionChange: Function
) {
  // TODO: call api

  notifyOfPossessionChange(playerId);
}

// Create a group of PlayerDraggable JSX Elements and default to non having possession
export function createPlayerDraggables(
  players: Player[],
  notifyOfPossessionChange: Function
): any[] {
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
    const possession: Possession = {
      hasPossession: false, // No player created has possession
      notifyOfPossessionChange: notifyOfPossessionChange,
    };

    playerDraggables.push(
      <PlayerDraggable player={player} possession={possession} />
    );
  }

  return playerDraggables;
}

// Create a single PlayerDraggable JSX Element
export function createPlayerDraggable(
  player: Player,
  hasPossession: boolean,
  notifyOfPossessionChange: Function
): any {
  const possession: Possession = {
    hasPossession: hasPossession,
    notifyOfPossessionChange: notifyOfPossessionChange,
  };
  return <PlayerDraggable player={player} possession={possession} />;
}

export default Player;

import React from "react";
import { useDrag } from "react-dnd";
import { DraggableTypes } from "../constants";
import { Button } from "react-bootstrap";
import axios from "axios";
import authHeader from "../services/auth.header";
import { MatchIdContext } from "./Recording.page";
import Player from "./interfaces/player";

type Possession = {
  hasPossession: boolean; // Whether or not the the player has possession of the ball
  notifyOfPossessionChange: Function; // A callback to notify Field of possession change
};

// API DTO's
type OppositionPossessionDTO = {
  matchId: number;
  time: number;
};

type PlayerPossessionDTO = {
  matchId: number;
  time: number;
  playerId: number;
};

type DraggableProps = {
  player: Player;
  possession: Possession;
};

export const PlayerDraggable = (props: DraggableProps) => {
  const player: Player = {
    firstName: props.player.firstName,
    lastName: props.player.lastName,
    jerseyNum: props.player.jerseyNum,
    teamId: props.player.teamId,
    playerId: props.player.playerId,
  };

  const [, drag] = useDrag({
    item: { type: DraggableTypes.PLAYER, player },
  });

  if (player.teamId !== -1) {
    if (props.possession.hasPossession) {
      return (
        <Button ref={drag} variant="outline-dark">
          {player.jerseyNum} {player.firstName} {player.lastName}
        </Button>
      );
    } else {
      return (
        <MatchIdContext.Consumer>
          {(matchId) => (
            <Button
              ref={drag}
              variant="dark"
              onClick={() =>
                changePossession(
                  player.playerId,
                  props.possession.notifyOfPossessionChange,
                  matchId
                )
              }
            >
              {player.jerseyNum} {player.firstName} {player.lastName}
            </Button>
          )}
        </MatchIdContext.Consumer>
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
        <MatchIdContext.Consumer>
          {(matchId) => (
            <Button
              variant="danger"
              onClick={() =>
                changePossession(
                  player.playerId,
                  props.possession.notifyOfPossessionChange,
                  matchId
                )
              }
            >
              Opposition
            </Button>
          )}
        </MatchIdContext.Consumer>
      );
    }
  }
};

function changePossession(
  playerId: number,
  notifyOfPossessionChange: Function,
  matchId: number
) {
  if (playerId === -1) {
    let possessionEvent: OppositionPossessionDTO = {
      matchId: matchId,
      time: Date.now() % 10000, // TODO: switch to game time
    };
    axios
      .post(`/event/possession/opposition`, possessionEvent, {
        headers: authHeader(),
      })
      .then((res) => {
        console.log("Post opposition possession response:", res); // TODO: catch error and handle if needed
      });
  } else {
    let possessionEvent: PlayerPossessionDTO = {
      matchId: matchId,
      time: Date.now() % 10000, // TODO: switch to game time
      playerId: playerId,
    };
    axios
      .post(`/event/possession/player`, possessionEvent, {
        headers: authHeader(),
      })
      .then((res) => {
        console.log("Post player possession response:", res); // TODO: catch error and handle if needed
      });
  }

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
      jerseyNum: players[i].jerseyNum,
      teamId: players[i].teamId,
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

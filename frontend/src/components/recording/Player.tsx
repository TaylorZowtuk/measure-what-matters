import React from "react";
import { useDrag } from "react-dnd";
import { DraggableTypes } from "../../constants";
import { Button } from "react-bootstrap";
import { MatchIdContext } from "./Recording.page";
import Player from "../interfaces/player";
import { OppositionPossessionDTO } from "../interfaces/oppositionPossession";
import { PlayerPossessionDTO } from "../interfaces/playerPossession";
import RestClient from "../../services/restClient.service";

type Possession = {
  hasPossession: boolean; // Whether or not the the player has possession of the ball
  notifyOfPossessionChange: Function; // A callback to notify Field of possession change
};

type DraggableProps = {
  player: Player;
  possession: Possession;
};

const restClient: RestClient = RestClient.getInstance();

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
  if (!window._recordingState.getTimerIsOn()) return; // If time is not running dont allow passing
  if (playerId === -1) {
    let possessionEvent: OppositionPossessionDTO = {
      matchId: matchId,
      time: window._recordingState.getCurrentTotalPlayTime(),
    };
    restClient
      .post(`/api/event/possession/opposition`, possessionEvent)
      .then((res) => {
        console.log("Post opposition possession response:", res); // TODO: catch error and handle if needed
      });
  } else {
    let possessionEvent: PlayerPossessionDTO = {
      matchId: matchId,
      time: window._recordingState.getCurrentTotalPlayTime(),
      playerId: playerId,
    };
    restClient.post(`/api/event/possession/player`, possessionEvent).then((res) => {
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

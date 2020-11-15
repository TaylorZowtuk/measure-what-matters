import React from "react";
import { DraggableTypes } from "../constants";
import { DropTargetMonitor, useDrop } from "react-dnd";

import { Button, Table } from "react-bootstrap";

import authHeader from "../services/auth.header";
import axios from "axios";

import Player from "./Player";
import { MatchIdContext } from "./Recording.page";

export type StartingPlayer = {
  id?: number;
  playerId: number;
  matchId: number;
  timeOn: number;
  timeOff: number;
};

type Substitution = {
  playerIdIn: number;
  playerIdOut: number;
  matchId: number;
  time: number;
};

type BenchProps = {
  getStartingBench: Function;
  notifyOfSubs: Function;
  inShootingState: boolean;
};

class Bench extends React.Component<
  BenchProps,
  {
    onBench: Player[];
    // The bench is in the expanded state once a player from the field
    // has been dragged into the bench
    isExpanded: boolean;
    // Player object of who to swap in to the bench from the field
    substituteFor: Player | undefined;
  }
> {
  constructor(props: BenchProps) {
    super(props);
    this.state = {
      onBench: this.props.getStartingBench(),
      isExpanded: false,
      substituteFor: undefined,
    };
  }

  setBench = (players: Player[]): void => {
    this.setState({ onBench: players });
  };

  addToBench = (player: Player) => {
    this.setState((state) => {
      const onBench = state.onBench.concat(player);
      return { onBench: onBench };
    });
  };

  removeFromBench = (removeId: number): Player | undefined => {
    // Remove the player (first instance) from onBench whose number is num
    var array = [...this.state.onBench];
    var index = array.findIndex((player) => player.playerId === removeId);
    if (index !== -1) {
      let p = array.splice(index, 1)[0];
      this.setState({ onBench: array }); // Remove the player and return it
      return p;
    } else {
      console.log("Error: no element in onBench had num of", removeId);
      return undefined;
    }
  };

  toggleIsExpanded = (): void => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  setSubstituteFor = (player: Player): void => {
    this.setState({ substituteFor: player });
  };

  clearSubstituteFor = (): void => {
    this.setState({ substituteFor: undefined });
  };

  substitute = (playerId: number, matchId: number): void => {
    if (this.state.substituteFor === undefined) {
      console.log("Error: substituteFor is undefined");
      return;
    }
    let sub: Substitution = {
      playerIdIn: this.state.onBench[
        this.state.onBench.findIndex((player) => player.playerId === playerId)
      ].playerId, // Player who is coming onto field
      playerIdOut: this.state.substituteFor.playerId, // Player who is leaving field
      matchId: matchId,
      time: Date.now(),
    };
    axios
      .post(`/event/substitutions`, sub, { headers: authHeader() })
      .then((res) => {
        console.log("Post sub response:", res); // TODO: catch error and handle if needed
      });
    let moveToField = this.removeFromBench(playerId); // Remove player from bench
    this.addToBench(this.state.substituteFor); // Add player from field to bench
    this.props.notifyOfSubs(this.state.substituteFor, moveToField); // Notify field of a substitution
    this.clearSubstituteFor();
    this.toggleIsExpanded(); // Close the bench
  };

  componentDidUpdate(_prevProps: any, _prevState: any) {}

  render() {
    if (this.props.inShootingState) return null; // If were in the shooting state, hide the bench

    if (this.state.isExpanded) {
      return (
        <OpenBench players={this.state.onBench} substitute={this.substitute} />
      );
    } else {
      return (
        <BenchTarget
          isExpanded={this.state.isExpanded}
          toggleIsExpanded={this.toggleIsExpanded}
          setSubstituteFor={this.setSubstituteFor}
        />
      );
    }
  }
}

type BenchTargetProps = {
  isExpanded: boolean;
  toggleIsExpanded: Function;
  setSubstituteFor: Function; // Function which takes the num of the Player that was dragged
};

function BenchTarget(props: BenchTargetProps) {
  const [, drop] = useDrop({
    accept: DraggableTypes.PLAYER,
    drop: (item: any, _monitor: DropTargetMonitor) => {
      if (item.player.teamId !== -1) {
        // Only allow our players to be dropped on bench
        props.toggleIsExpanded();
        props.setSubstituteFor(item.player);
      }
    },
  });

  return (
    <div ref={drop} id="bench">
      <h2>Bench</h2>
      <h6>Drag players here to substitute</h6>
    </div>
  );
}

type OpenBenchProps = {
  players: Player[];
  substitute: Function;
};

export function OpenBench(props: OpenBenchProps) {
  return (
    <Table responsive borderless>
      <tbody>
        <tr>
          {props.players.map((player: Player) => (
            <td>
              <MatchIdContext.Consumer>
                {(matchId) => (
                  <Button
                    key={player.playerId}
                    variant="dark"
                    onClick={() => props.substitute(player.playerId, matchId)}
                  >
                    {player.jerseyNum} {player.firstName} {player.lastName}
                  </Button>
                )}
              </MatchIdContext.Consumer>
            </td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
}

export default Bench;

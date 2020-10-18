import React from "react";
import { DraggableTypes } from "../constants";
import { useDrop } from "react-dnd";

import Player, { createPlayerDraggable, PlayerDraggable } from "./Player";
import { roster } from "./Bench";

type FieldProps = {
  incrementScore: Function;
  removeFromField: Player | undefined;
  addToField: Player | undefined;
  resetSubs: Function;
};

class Field extends React.Component<
  FieldProps,
  {
    onField: any[]; // Array of draggablePlayer jsx elements
  }
> {
  constructor(props: FieldProps) {
    super(props);
    this.state = {
      onField: createPlayerDraggable(this.getPlayers().slice(0, 6)),
    };
  }

  getPlayers = (): Player[] => {
    return roster;
  };

  addToField = (player: Player | undefined): void => {
    if (player === undefined) {
      console.log("Error player to add to field was undefined");
    } else {
      let ret_arr: any = createPlayerDraggable([player]);
      let playerDraggable = ret_arr[0];
      this.setState((state) => {
        const onField = state.onField.concat(playerDraggable);
        return { onField: onField };
      });
    }
  };

  removeFromField = (player: Player | undefined): void => {
    if (player === undefined) {
      console.log("Error player to add to field was undefined");
    } else {
      var array = [...this.state.onField];
      var index = array.findIndex(
        (playerDraggable) => playerDraggable.number === player.num
      );
      if (index !== -1) {
        return array.splice(index, 1)[0]; // Remove the player and return it
      } else {
        console.log("Error: no element in onField had num of", player.num);
        return undefined;
      }
    }
  };

  substitute = (): void => {
    this.removeFromField(this.props.removeFromField); // TODO: player is not being removed from field
    this.addToField(this.props.addToField);
    this.props.resetSubs(undefined, undefined); // Reset subs
  };

  componentDidUpdate(prevProps: any, _prevState: any) {
    if (
      this.props.removeFromField !== undefined &&
      this.props.addToField !== undefined
    ) {
      this.substitute();
    }
  }

  render() {
    return (
      <FieldTarget
        draggablePlayers={this.state.onField}
        incrementScore={this.props.incrementScore}
      />
    );
  }
}

type FieldTargetProps = {
  draggablePlayers: any[];
  incrementScore: Function;
};

function FieldTarget(props: FieldTargetProps) {
  const [, drop] = useDrop({
    accept: DraggableTypes.PLAYER,
    drop: (item, monitor) => props.incrementScore(true),
    // drop: (item, monitor) => {props.increment_score(     // TODO: increment correct teams score
    //     (monitor.team == "ours") ? true : false
    // )},
  });

  return (
    <div ref={drop} id="Field">
      {props.draggablePlayers.map((player, index) => (
        <div className="player" key={index}>
          {player}
        </div>
      ))}
      {/* Opposing team number is null*/}
      {/* <Player identifier="Bad Guys" number={-1} team="theirs"/>  */}
    </div>
  );
}

export default Field;

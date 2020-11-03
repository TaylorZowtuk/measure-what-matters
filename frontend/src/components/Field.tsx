import React from "react";
import { DraggableTypes } from "../constants";
import { useDrop } from "react-dnd";
import { Container } from "react-bootstrap";

import Player, { createPlayerDraggable, PlayerDraggable } from "./Player";

type FieldProps = {
  getStartingLine: Function;
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
      onField: createPlayerDraggable(this.props.getStartingLine().slice(0, 6)),
    };
  }

  getOnField = (): Player[] => {
    return this.state.onField;
  };

  addToField = (player: Player | undefined): void => {
    if (player === undefined) {
      console.log("Error: player to add to field was undefined");
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
      console.log("Error: player to add to field was undefined");
    } else {
      var array = [...this.state.onField];
      var index = array.findIndex(
        (playerDraggable) => playerDraggable.props.num === player.num
      );
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ onField: array });
      } else {
        console.log("Error: no element in onField had num of", player.num);
      }
    }
  };

  substitute = (): void => {
    this.removeFromField(this.props.removeFromField);
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
        getLineup={this.getOnField}
      />
    );
  }
}

type FieldTargetProps = {
  draggablePlayers: any[];
  incrementScore: Function;
  getLineup: Function;
};

export function FieldTarget(props: FieldTargetProps) {
  const [, drop] = useDrop({
    accept: DraggableTypes.PLAYER,
    drop: (item: any, monitor) =>
      props.incrementScore(true, item.player, props.getLineup()),
    // drop: (item, monitor) => {props.increment_score(     // TODO: increment correct teams score
    //     (monitor.team == "ours") ? true : false
    // )},
  });

  return (
    // TODO: make field span the width of the screen
    <Container ref={drop} style={{ backgroundColor: "#0A872B" }} id="Field">
      {props.draggablePlayers.map((player, index) => (
        <div key={index}>{player}</div>
      ))}
      {/* Opposing team number is null*/}
      <div>
        <PlayerDraggable
          first_name="Opposing" // Not used
          last_name="Team" // Not used
          num={-1} // Not used
          team="theirs"
          playerId={-1} // Not used
        />
      </div>
    </Container>
  );
}

export default Field;

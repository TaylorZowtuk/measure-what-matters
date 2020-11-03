import React from "react";
import { DraggableTypes } from "../constants";
import { useDrop } from "react-dnd";
import { Container, Row, Col } from "react-bootstrap";

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
    drop: (item: any, monitor) => {
      const ourGoal: Boolean = item.player.team === "ours" ? true : false;
      props.incrementScore(ourGoal, item.player, props.getLineup());
    },
  });

  return (
    // TODO: determine a way to avoid hard coding this table or present in a more clear manner
    // prettier-ignore
    <Container ref={drop} style={{ backgroundColor: "#0A872B" }} id="Field">
    {/* 0 */}
            <Row>
              {/* 0           1           2                                     3 */}
              <Col></Col> <Col></Col> <Col>{props.draggablePlayers[3]}</Col> <Col></Col>
            </Row>
    {/* 1 */}
            <Row>
              {/* 0           1                                     2           3 */}
              <Col></Col> <Col>{props.draggablePlayers[1]}</Col> <Col></Col> <Col></Col>
            </Row>
    {/* 2 */}
            <Row>
              {/* 0                                     1             2                                   3 */}
              <Col>{props.draggablePlayers[0]}</Col> <Col></Col> <Col>{props.draggablePlayers[4]}</Col> <Col><PlayerDraggable first_name="Opposing" last_name="Team" num={-1} team="theirs" playerId={-1}/></Col>
            </Row>
    {/* 3 */}
            <Row>
              {/* 0           1                                     2           3 */}
              <Col></Col> <Col>{props.draggablePlayers[2]}</Col> <Col></Col> <Col></Col>
            </Row>
    {/* 4 */}
            <Row>
              {/* 0           1           2                                     3 */}
              <Col></Col> <Col></Col> <Col>{props.draggablePlayers[5]}</Col> <Col></Col>
            </Row>
    </Container>
  );
}

export default Field;

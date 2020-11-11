import React from "react";
import { DraggableTypes } from "../constants";
import { useDrop } from "react-dnd";
import { Container, Row, Col } from "react-bootstrap";
import { cloneDeep } from "lodash";

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

    // Create the element that will represent the opposing team on the field
    const oppositionPlayer: Player = {
      firstName: "Opposing",
      lastName: "Team",
      num: -1,
      team: "theirs",
      playerId: -1,
    };
    const oppositionDraggable: typeof PlayerDraggable = createPlayerDraggable([
      oppositionPlayer,
    ])[0];

    // Create elements representing our starting line
    let initialPlayersOnField = createPlayerDraggable(
      this.props.getStartingLine().slice(0, 6)
    );
    // Add the opposition
    initialPlayersOnField.push(oppositionDraggable);

    this.state = {
      // Index 0 is goalie; 1 & 2 are defence; 3, 4, & 5 are forwards; 6 is opposition
      onField: initialPlayersOnField,
    };
  }

  getOnField = (): Player[] => {
    return this.state.onField;
  };

  addToField = (player: Player | undefined, lastRemovedIndex: number): void => {
    console.log(player, lastRemovedIndex);
    if (player === undefined) {
      console.log("Error: player to add to field was undefined");
    } else {
      let ret_arr: any = createPlayerDraggable([player]);
      let playerDraggable = ret_arr[0];

      this.setState((state) => {
        var onFieldCopy: any[] = cloneDeep(this.state.onField);
        onFieldCopy.splice(lastRemovedIndex, 0, playerDraggable);
        return { onField: onFieldCopy };
      });
    }
  };

  removeFromField = async (player: Player | undefined): Promise<number> => {
    var index = -1;
    if (player === undefined) {
      console.log("Error: player to add to field was undefined");
    } else {
      var onFieldCopy = [...this.state.onField];
      index = onFieldCopy.findIndex(
        (playerDraggable) => playerDraggable.props.num === player.num
      );
      if (index !== -1) {
        onFieldCopy.splice(index, 1);
        await this.setState({ onField: onFieldCopy });
      } else {
        console.log("Error: no element in onField had num of", player.num);
      }
    }
    return index;
  };

  substitute = async (): Promise<void> => {
    var lastRemovedIndex = await this.removeFromField(
      this.props.removeFromField
    );
    this.addToField(this.props.addToField, lastRemovedIndex);
    this.props.resetSubs(undefined, undefined); // Reset subs
  };

  async componentDidUpdate(prevProps: any, _prevState: any) {
    if (
      prevProps !== this.props &&
      this.props.removeFromField !== undefined &&
      this.props.addToField !== undefined
    ) {
      await this.substitute();
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
              <Col>{props.draggablePlayers[0]}</Col> <Col></Col> <Col>{props.draggablePlayers[4]}</Col> <Col>{props.draggablePlayers[6]}</Col>
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

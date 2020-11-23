import React from "react";
import { DraggableTypes } from "../../constants";
import { useDrop } from "react-dnd";
import { Container, Row, Col } from "react-bootstrap";
import { cloneDeep } from "lodash";
import { CircularBuffer } from "../../util/circular-buffer";

import { createPlayerDraggable, createPlayerDraggables } from "./Player";
import Player from "../interfaces/player";
import { NeutralPossessionDTO } from "../interfaces/neutralPossession";
import { ShotFieldInfo } from "./ShotResultPicker";
import RestClient from "../../services/restClient.service";

type FieldProps = {
  matchId: number;
  getStartingLine: Function;
  inShootingState: boolean;
  enterShootingState: Function;
  removeFromField: Player | undefined;
  addToField: Player | undefined;
  resetSubs: Function;
};

class Field extends React.Component<
  FieldProps,
  {
    onField: JSX.Element[]; // Array of draggablePlayer jsx elements
    playerIndexWithPossession: number; // The index into onField of the player who currently has possession of the ball
  }
> {
  private restClient: RestClient;
  constructor(props: FieldProps) {
    super(props);
    this.restClient = RestClient.getInstance();
    // Create the element that will represent the opposing team on the field
    const oppositionPlayer: Player = {
      firstName: "Opposing",
      lastName: "Team",
      jerseyNum: -1,
      teamId: -1,
      playerId: -1,
    };
    const oppositionDraggable = createPlayerDraggable(
      oppositionPlayer,
      false,
      this.changePossession
    );

    // Create elements representing our starting line
    let initialPlayersOnField = createPlayerDraggables(
      this.props.getStartingLine().slice(0, 6),
      this.changePossession
    );
    // Add the opposition
    initialPlayersOnField.push(oppositionDraggable);

    this.state = {
      // Index 0 is goalie; 1 & 2 are defence; 3, 4, & 5 are forwards; 6 is opposition
      onField: initialPlayersOnField,
      playerIndexWithPossession: Number.NEGATIVE_INFINITY,
    };
  }

  // A circular buffer which contains playerId's of players to last touch the ball
  previousPossessions = new CircularBuffer<number>(2); // Can only have one assist

  getOnField = (): any[] => {
    // Return all the PlayerDraggables on the field except the opposition
    return this.state.onField.slice(0, -1);
  };

  addToField = (player: Player | undefined, lastRemovedIndex: number): void => {
    if (player === undefined) {
      console.log("Error: player to add to field was undefined");
    } else {
      let playerDraggable: any = createPlayerDraggable(
        player,
        false,
        this.changePossession
      );

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
      console.log("Error: player to remove from field was undefined");
    } else {
      var onFieldCopy = [...this.state.onField];
      index = onFieldCopy.findIndex(
        (playerDraggable) =>
          playerDraggable.props.player.playerId === player.playerId
      );
      if (index !== -1) {
        // If the player had the ball, call resetPlayerWithPossession but dont reset previous possessions
        if (index === this.state.playerIndexWithPossession)
          this.resetPlayerWithPossession();
        onFieldCopy.splice(index, 1);
        await this.setState({ onField: onFieldCopy });
      } else {
        console.log("Error: no element in onField had num of", player.playerId);
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

  changePossession = (playerId: number): void => {
    let onFieldCopy = [...this.state.onField];

    // Remove the possesion from the last player with possesion
    if (this.state.playerIndexWithPossession !== Number.NEGATIVE_INFINITY) {
      // If the ball wasnt in neutral possession
      let playerDragWithoutPossession = createPlayerDraggable(
        onFieldCopy[this.state.playerIndexWithPossession].props.player,
        false,
        this.changePossession
      );
      onFieldCopy[
        this.state.playerIndexWithPossession
      ] = playerDragWithoutPossession;
    }

    let index = Number.NEGATIVE_INFINITY;
    if (playerId !== Number.NEGATIVE_INFINITY) {
      // Find the player on the field with playerId
      index = onFieldCopy.findIndex(
        (playerDraggable) => playerDraggable.props.player.playerId === playerId
      );

      // Replace the PlayerDraggable of that player with a new PlayerDraggable
      // that indicates they have ball possesion
      let playerDragWithPossession = createPlayerDraggable(
        onFieldCopy[index].props.player,
        true,
        this.changePossession
      );
      onFieldCopy[index] = playerDragWithPossession;
      this.previousPossessions.enqueue(playerId);
    }
    // Update players on field and player with possession
    this.setState({ onField: onFieldCopy, playerIndexWithPossession: index });
  };

  resetPlayerWithPossession = (): void => {
    if (this.state.playerIndexWithPossession !== Number.NEGATIVE_INFINITY) {
      // Reset possession state
      this.changePossession(Number.NEGATIVE_INFINITY);

      // Post to neutral ball endpoint
      let possessionEvent: NeutralPossessionDTO = {
        matchId: this.props.matchId,
        time: window._recordingState.getCurrentTotalPlayTime(),
      };
      this.restClient
        .post(`/event/possession/neutral`, possessionEvent)
        .then((res) => {
          console.log("Post neutral possession response:", res); // TODO: catch error and handle if needed
        });
    } // Else, nobody currently has the ball, so do nothing
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
    if (this.props.inShootingState) {
      // If were in the shooting state hide the field
      return null;
    }

    return (
      <FieldTarget
        enterShootingState={this.props.enterShootingState}
        draggablePlayers={this.state.onField}
        playerIndexWithPossession={this.state.playerIndexWithPossession}
        previousPossessions={this.previousPossessions}
        resetPlayerWithPossession={this.resetPlayerWithPossession}
        getLineup={this.getOnField}
      />
    );
  }
}

type FieldTargetProps = {
  enterShootingState: Function;
  draggablePlayers: any[];
  playerIndexWithPossession: number;
  previousPossessions: CircularBuffer<number>;
  resetPlayerWithPossession: Function;
  getLineup: Function;
};

export function FieldTarget(props: FieldTargetProps) {
  const [, drop] = useDrop({
    accept: DraggableTypes.PLAYER,
    drop: (item: any, monitor) => {
      // A shot was taken
      if (
        props.playerIndexWithPossession !== Number.NEGATIVE_INFINITY &&
        item.player.playerId ===
          props.draggablePlayers[props.playerIndexWithPossession].props.player
            .playerId
      ) {
        // Only allow the player who currently has the ball to 'shoot'
        props.resetPlayerWithPossession();
        let shotFieldInfo: ShotFieldInfo = {
          shooter: item.player,
          previousPossessions: props.previousPossessions,
          getLineup: props.getLineup,
        };
        props.enterShootingState(true, shotFieldInfo);
      }
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

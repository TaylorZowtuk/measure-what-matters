import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import authHeader from "../../services/auth.header";
import RestClient from "../../services/restClient.service";

import CircularBuffer from "../../util/circular-buffer";
import Player from "../interfaces/player";
import { ShotDTO } from "../interfaces/shot";
import { MatchIdContext } from "./Recording.page";

export type ShotResultPickerProps = {
  shooting: boolean;
  propsIfGoal: GoalOnClickProps;
};

const restClient: RestClient = RestClient.getInstance();

export function ShotResultPicker(props: ShotResultPickerProps) {
  // If the recording state is not shooting, then dont render
  if (!props.shooting) {
    return null;
  }

  return (
    <MatchIdContext.Consumer>
      {(matchId) => (
        <div>
          <Row>
            <h6>Make a selection for the result of the shot</h6>
          </Row>
          {/* Display a button for each possible outcome of a shot */}

          <Row style={{ marginBottom: "50px" }}>
            <Col>
              <Button
                variant="danger"
                onClick={() =>
                  shotOnClick({
                    onTarget: false,
                    shooter: props.propsIfGoal.fieldInfo.shooter,
                    matchId: matchId,
                    exitShootingState: props.propsIfGoal.exitShootingState,
                  })
                }
              >
                Miss
              </Button>
            </Col>
            <Col>
              <Button
                variant="warning"
                onClick={() =>
                  shotOnClick({
                    onTarget: true,
                    shooter: props.propsIfGoal.fieldInfo.shooter,
                    matchId: matchId,
                    exitShootingState: props.propsIfGoal.exitShootingState,
                  })
                }
              >
                Save
              </Button>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() => goalOnClick(props.propsIfGoal)}
              >
                Goal
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </MatchIdContext.Consumer>
  );
}

export type ShotFieldInfo = {
  shooter: Player;
  previousPossessions: CircularBuffer<number>;
  getLineup: Function;
};

export type GoalOnClickProps = {
  fieldInfo: ShotFieldInfo;
  matchId: number;
  incrementScore: Function;
  exitShootingState: Function;
};

function goalOnClick(props: GoalOnClickProps) {
  const ourGoal: Boolean = props.fieldInfo.shooter.teamId !== -1 ? true : false;
  props.incrementScore(
    ourGoal,
    props.fieldInfo.shooter,
    props.fieldInfo.previousPossessions,
    props.fieldInfo.getLineup()
  );

  // Call shot endpoint
  shotOnClick({
    onTarget: true,
    shooter: props.fieldInfo.shooter,
    matchId: props.matchId,

    exitShootingState: props.exitShootingState,
  });
  props.exitShootingState();
}

type ShotOnClickProps = {
  onTarget: boolean;
  shooter: Player;
  matchId: number;
  exitShootingState: Function;
};

// This on click handler can be used by either misses or saves because
// they only differ by props.onTarget bool
function shotOnClick(props: ShotOnClickProps) {
  if (props.shooter.playerId !== -1) {
    // If the shooter was our player, send a post to the shot endpoint
    let shot: ShotDTO = {
      matchId: props.matchId,
      time: Date.now() % 100000,
      playerId: props.shooter.playerId,
      onTarget: props.onTarget,
    };

    restClient.post(`/event/shots`, shot).then((res) => {
      console.log("Post shot response:", res); // TODO: catch error and handle if needed
    });
  }

  // TODO: handle player who took a shot being able to shoot again because we cant reset
  // previous possession on a miss
  props.exitShootingState();
}

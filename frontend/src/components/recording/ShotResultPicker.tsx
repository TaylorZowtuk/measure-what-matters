import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import CircularBuffer from "../../util/circular-buffer";
import Player from "../interfaces/player";

type ShotResultPickerProps = {
  shooting: boolean;
  propsIfGoal: GoalOnClickProps;
};

export function ShotResultPicker(props: ShotResultPickerProps) {
  // If the recording state is not shooting, then dont render
  if (!props.shooting) {
    return null;
  }

  return (
    <div>
      <Row>
        <h6>Make a selection for the result of the shot</h6>
      </Row>
      <Row>
        <Col>
          <Button variant="danger">Miss</Button>
        </Col>
        <Col>
          <Button variant="warning">Save</Button>
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
  );
}
export type ShotFieldInfo = {
  shooter: Player;
  previousPossessions: CircularBuffer<number>;
  getLineup: Function;
};

type GoalOnClickProps = {
  fieldInfo: ShotFieldInfo;
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
  props.exitShootingState();
}

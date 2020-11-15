import React from "react";
import { Button, Row } from "react-bootstrap";

type ShotResultPickerProps = {
  shooting: boolean;
};
export function ShotResultPicker(props: ShotResultPickerProps) {
  // If the recording state is not shooting, then dont render
  if (!props.shooting) {
    return null;
  }

  return (
    <Row>
      <Button>Miss</Button>
      <Button>Save</Button>
      <Button>Goal</Button>
    </Row>
  );
}

import React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Col, Container, Row } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  const StyledProgress = withStyles({
    colorPrimary: {
      // Set color to green if our possession time is better than 50 % o.w. set it to red
      color: props.value >= 50 ? "#28a745" : "#dc3545",
    },
  })(CircularProgress);

  return (
    <Box position="relative" display="inline-flex">
      <StyledProgress
        variant="static"
        value={props.value}
        size={80}
        thickness={6}
        color="primary"
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h6"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function fetchTimes(debug = true): number[] {
  if (debug) {
    // Return 3 hardcoded values
    return [68, 32, 50];
  }

  // TODO: connect to backend
  return [68, 32, 50];
}

export default function PossessionCircular() {
  let times: number[] = fetchTimes();
  while (times.length < 3) {
    // If there was a problem with fetch, then display 0's
    times.push(0);
  }

  return (
    <Container>
      <h4>Possession Time</h4>
      <Row>
        <Col>
          <h5>First Half</h5>
          <CircularProgressWithLabel value={times[0]} />
        </Col>
        <Col>
          <h5>Second Half</h5>
          <CircularProgressWithLabel value={times[1]} />
        </Col>
        <Col>
          <h5>Overall</h5>
          <CircularProgressWithLabel value={times[2]} />
        </Col>
      </Row>
    </Container>
  );
}

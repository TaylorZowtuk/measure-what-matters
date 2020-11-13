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

export default function CircularStatic() {
  // TODO: create function to get values
  // TODO: mock data
  // TODO: connect to backend
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h5>First Half Possession</h5>
          <CircularProgressWithLabel value={progress} />
        </Col>
        <Col>
          <h5>Second Half Possession</h5>
          <CircularProgressWithLabel value={progress} />
        </Col>
        <Col>
          <h5>Overall Possession</h5>
          <CircularProgressWithLabel value={progress} />
        </Col>
      </Row>
    </Container>
  );
}

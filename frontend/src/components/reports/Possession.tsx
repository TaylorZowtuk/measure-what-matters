import React, { useEffect, useState } from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Col, Container, Row } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";
import ReportProps from "../interfaces/props/report-props";
import { teamPossessionDTO } from "../interfaces/team-possession";
import axios from "axios";
import authHeader from "../../services/auth.header";

export function CircularProgressWithLabel(
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

export async function fetchTimes(
  matchId: number,
  debug = false
): Promise<number[]> {
  if (debug) {
    // Return 3 hardcoded values
    return [68, 32, 50];
  }

  const res = await axios.get(
    `/player-stats/team-possession?matchId=${matchId}`,
    {
      headers: authHeader(),
    }
  );
  let resData: teamPossessionDTO = res.data;
  console.log("Get possession times response:", resData); // Handle errors
  return [
    resData.firstHalfPossOurTeam,
    resData.secondHalfPossOurTeam,
    resData.fullGamePossOurTeam,
  ];
}

type PossessionCircularProps = {
  fetchTimes: Function; // Dependency inject for testing
};

export default function PossessionCircular(
  props: PossessionCircularProps & ReportProps
) {
  const [possessions, setPossessions] = useState<number[] | null>(null);
  useEffect(() => {
    async function getPossessions() {
      if (props.matchId) {
        setPossessions(await props.fetchTimes(props.matchId));
      }
    }
    getPossessions();
  }, [props]);
  // If no match is selected on the dashboard, display nothing
  if (!props.matchId) return null;
  // If we havent completed the asynchronous data fetch yet
  if (!possessions) return <CircularProgress />;

  return (
    <Container>
      <h4>Possession Time</h4>
      <Row>
        <Col>
          <h5>First Half</h5>
          <CircularProgressWithLabel value={possessions[0]} />
        </Col>
        <Col>
          <h5>Second Half</h5>
          <CircularProgressWithLabel value={possessions[1]} />
        </Col>
        <Col>
          <h5>Overall</h5>
          <CircularProgressWithLabel value={possessions[2]} />
        </Col>
      </Row>
    </Container>
  );
}

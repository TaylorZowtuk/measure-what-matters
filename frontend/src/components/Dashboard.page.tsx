import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField, { fetchTimeOnFieldRows } from "./reports/TimeOnField";
import LineupGoal from "./reports/LineupGoal";
import { Col, Container, Row } from "react-bootstrap";
import MatchDropdown from "./reports/MatchDropdown";
import PossessionCircular, { fetchTimes } from "./reports/Possession";
import TouchesTable, { fetchTouchesRows } from "./reports/Touches";
import PlusMinusComponent from "./reports/PlusMinus";

const Dashboard = () => {
  const [matchId, setMatchId] = React.useState<number | undefined>(undefined);
  const handleMatchIdChange = (matchId: number) => {
    setMatchId(matchId);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <br></br>

      {/* Navigation */}
      <MatchDropdown
        matchId={matchId}
        handleMatchIdChange={handleMatchIdChange}
      />
      {/* Navigation */}
      <Link to="/matches/upcoming">
        <Button variant="contained">Recording</Button>
      </Link>
      <Link to="/teams">
        <Button variant="contained">Teams</Button>
      </Link>
      <Link to="/create-match">
        <Button variant="contained">Create Match</Button>
      </Link>
      <Link to="/view-account">
        <Button variant="contained">Account</Button>
      </Link>

      {/* Reports */}
      <Container style={{ backgroundColor: "#282c34" }}>
        <Row style={{ margin: "20px" }}>
          <Col>
            <PossessionCircular fetchTimes={fetchTimes} matchId={matchId} />
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col>
            <TouchesTable fetchTouches={fetchTouchesRows} matchId={matchId} />
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col>
            <TimeOnField
              fetchTimeOnField={fetchTimeOnFieldRows}
              matchId={matchId}
            />
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col>
            <LineupGoal matchId={matchId} />
          </Col>
        </Row>
        <Row style={{ margin: "20px" }}>
          <Col>
            <PlusMinusComponent matchId={matchId} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Dashboard;

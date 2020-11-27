import React from "react";
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
  if (matchId) {
    return (
      <Container style={{ backgroundColor: "#282c34" }}>
        <div className="dashboard">
          <h1>Dashboard</h1>
          <br></br>

          <MatchDropdown
            matchId={matchId}
            handleMatchIdChange={handleMatchIdChange}
          />

          {/* Reports */}
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
        </div>
      </Container>
    );
  } else {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <br></br>
        <MatchDropdown
          matchId={matchId}
          handleMatchIdChange={handleMatchIdChange}
        />
        <br></br>
        <h2>Select a match to view stats.</h2>
      </div>
    );
  }
};
export default Dashboard;

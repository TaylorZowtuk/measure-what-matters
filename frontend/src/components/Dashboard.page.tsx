import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";
import LineupGoal from "./reports/LineupGoal";
import { Col, Container, Row } from "react-bootstrap";
import MatchDropdown from "./reports/MatchDropdown";
import PossessionCircular, { fetchTimes } from "./reports/Possession";
import TouchesBar, { fetchTouches } from "./reports/Touches";
import PlusMinusComponent from "./reports/PlusMinus";

const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <br></br>

    {/* Navigation */}
    <MatchDropdown />
    <Link to="/matches/upcoming">
      <Button variant="contained">Recording</Button>
    </Link>
    <Link to="/teams">
      <Button variant="contained">Teams</Button>
    </Link>
    <Link to="/view-account">
      <Button variant="contained">Account</Button>
    </Link>

    {/* Reports */}
    <Container style={{ backgroundColor: "#282c34" }}>
      <Row style={{ margin: "20px" }}>
        <Col>
          <PossessionCircular fetchTimes={fetchTimes} />
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col>
          <TouchesBar fetchTouches={fetchTouches} />
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col>
          <TimeOnField />
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col>
          <LineupGoal />
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col>
          <PlusMinusComponent />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Dashboard;

import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";
import LineupGoal from "./reports/LineupGoal";
import { Col, Container, Row } from "react-bootstrap";
import PossessionCircular from "./reports/Possession";
import TouchesBar from "./reports/Touches";
import PlusMinusComponent from "./reports/PlusMinus";

const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <br></br>

    {/* Navigation */}
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
    <TimeOnField />
    <Container style={{ backgroundColor: "#282c34" }}>
      <Row style={{ margin: "20px" }}>
        <Col>
          <PossessionCircular />
        </Col>
      </Row>
      <Row style={{ margin: "20px" }}>
        <Col>
          <TouchesBar />
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

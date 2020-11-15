import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";
import { Col, Container, Row } from "react-bootstrap";
import PossessionCircular from "./reports/Possession";
import TouchesBar from "./reports/Touches";
import MatchDropdown from "./MatchDropdown/MatchDropdown";

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

    {/* Reports */}
    <Container style={{ backgroundColor: "#282c34" }}>
      <Row>
        <Col>
          <PossessionCircular />
        </Col>
      </Row>
      <Row>
        <Col>
          <TouchesBar />
        </Col>
      </Row>
      <Row>
        <Col>
          <TimeOnField />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Dashboard;

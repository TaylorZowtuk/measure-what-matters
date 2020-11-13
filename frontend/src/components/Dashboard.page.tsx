import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";
import CircularStatic from "./reports/Possession";
import { Col, Container, Row } from "react-bootstrap";

const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <br></br>

    {/* Navigation */}
    <Link
      to={{
        pathname: "/recording",
        state: {
          matchId: 1,
          teamId: 1,
        },
      }}
    >
      <Button variant="contained">Recording</Button>
    </Link>
    <Link to="/teams">
      <Button variant="contained">Teams</Button>
    </Link>

    {/* Reports */}
    <Container style={{ backgroundColor: "#282c34" }}>
      <Row>
        <Col>
          <CircularStatic />
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

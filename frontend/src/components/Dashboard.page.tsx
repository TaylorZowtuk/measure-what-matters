import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";

const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard Interface</h1>
    <p>Here is the dashboard</p>
    <br></br>
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
    <br></br>
    <Link to="/teams">
      <Button variant="contained">Teams</Button>
    </Link>
    <TimeOnField />
  </div>
);

export default Dashboard;

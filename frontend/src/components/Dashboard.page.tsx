import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";

const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <br></br>

    {/* Navigation */}
    <Link
      to={{
        pathname: "/lineup",
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
    <TimeOnField />
  </div>
);

export default Dashboard;

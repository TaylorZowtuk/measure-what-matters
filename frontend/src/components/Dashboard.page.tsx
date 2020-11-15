import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";
import LineupGoal from "./LineupGoal/LineupGoal";

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
    <TimeOnField />
    <br></br>
    <LineupGoal></LineupGoal>
  </div>
);

export default Dashboard;

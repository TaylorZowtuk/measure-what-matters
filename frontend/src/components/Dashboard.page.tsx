import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TimeOnField from "./reports/TimeOnField";

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
  </div>
);

export default Dashboard;

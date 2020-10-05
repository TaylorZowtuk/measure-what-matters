import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';


const Dashboard = () => (
    <div className='dashboard'>
      <h1>Dashboard Interface</h1>
      <p>Here is the dashboard</p>
      <Link to="/recording">
        <Button variant="contained">Recording</Button>
      </Link>
    </div>
  );

  export default Dashboard;
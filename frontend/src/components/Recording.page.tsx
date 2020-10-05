import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';


const Recording = () => (
    <div className='recording'>
      <h1>Recoding Interface</h1>
      <p>Here you will record</p>
      <Link to="/">
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
    
  );

export default Recording;
import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Player from './Player';


const Recording = () => (
    <div className='recording'>
      <h1>Recoding Interface</h1>
      <p>Here you will record</p>
      <Player />
      <Link to="/">
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
    
  );

export default Recording;
import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Player from './Player';


function Recording() {
  const players = [];
  for (var i = 0; i < 6; i++) { // 5 players + 1 goalie on field
    players.push(<Player />);
  }
  return (
    <div className='recording'>
      <h1>Recoding Interface</h1>
      <p>Here you will record</p>
      {players}
      <Link to="/">
        <Button variant="contained">Dashboard</Button>
      </Link>
    </div>
  )
}

export default Recording;
import React from 'react';
import { Link } from "react-router-dom";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import axios from 'axios';

import Button from '@material-ui/core/Button';
import Team from './Team';
import Bench from './Bench';
import Field from './Field';

type Goal = {
  matchId: number,
  time: number,
  playerId: number,
}


class Recording extends React.Component 
  <{}, 
  { 
    goals_against: number, 
    goals_for: number 
  }> {

  team_name:string = "Blue Blazers";
  opp_name:string = "Red Rockets";

  constructor() {
    super({});
    this.state = {
      goals_for: 0,
      goals_against: 0 
    }
  }

  incrementScore = (goal_for: boolean): void => {
    if (goal_for) {
      this.setState({goals_for: this.state.goals_for + 1});
      let goal:Goal = {
        matchId: 1, // TODO: get matchid
        time: Date.now(), // Epoch time in ms
        playerId: 1 // TODO: get playerid
      }
      console.log(goal)
      axios.post(`/events/goals`)
      .then(res => {
        console.log(res); // TODO: catch error and handle if needed
      })
    }
    else {
      this.setState({goals_against: this.state.goals_against + 1});
      // TODO: add backend call to add against goal
    }
  }

  render () {
    return (
      <DndProvider backend={HTML5Backend}>
      <div className='recording'>
        <h1>Recoding Interface</h1>
        <Bench></Bench>
        <Team name={this.team_name} score={this.state.goals_for} />
        <Team name={this.opp_name} score={this.state.goals_against} />
        <Field incrementScore={this.incrementScore}></Field>
        <Link to="/">
          <Button variant="contained">Dashboard</Button>
        </Link>
      </div>
      </DndProvider>
    )
  }
}

export default Recording;
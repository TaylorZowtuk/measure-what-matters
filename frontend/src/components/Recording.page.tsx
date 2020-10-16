import React from 'react';
import { Link } from "react-router-dom";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Button from '@material-ui/core/Button';
import Team from './Team';
import Player from './Player';
import Bench from './Bench';
import Field from './Field';


class Recording extends React.Component 
  <{}, { 
    goals_against: number, 
    goals_for: number 
  }> {

  players:any[] = []; // Draggable <Player />
  team_name:string = "Blue Blazers";
  opp_name:string = "Red Rockets";
  goals_for:number = 0;
  goals_against:number = 0;

  constructor() {
    super({});
    this.state = {
      goals_for: 0,
      goals_against: 0
      
    }
    this.create_players();
  }

  increment_score = (goal_for: boolean): void => {
    if (goal_for) {
      this.setState({goals_for: this.state.goals_for + 1});
      // TODO: add backend call to add for goal
    }
    else {
      this.setState({goals_against: this.state.goals_against + 1});
      // TODO: add backend call to add against goal
    }
  }
  
  create_players() {
    for (var i = 0; i < 6; i++) { // 5 players + 1 goalie on field
      this.players.push(<Player identifier="Good guy" number={i} team="ours"/>);
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
        <Field players={this.players} increment_score={this.increment_score}></Field>
        <Link to="/">
          <Button variant="contained">Dashboard</Button>
        </Link>
      </div>
      </DndProvider>
    )
  }
}

export default Recording;
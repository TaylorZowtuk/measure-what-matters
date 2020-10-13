import React from 'react';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Team from './Team';
import Player from './Player';


class Recording extends React.Component {
  // TODO: need to refactor into state
  players:any[] = []; // Draggable <Player />
  team_name:string = "Good guys";
  opp_name:string = "Bad guys";
  goals_for:number = 0;
  goals_against:number = 0;

  constructor() {
    super({});
    this.create_players();
  }

  increment_score = (goal_against: boolean): void => {
    if (goal_against) {
      this.goals_against = this.goals_against + 1;
    }
    else {
      this.goals_for = this.goals_for + 1;
    }
  }
  
  create_players() {
    for (var i = 0; i < 6; i++) { // 5 players + 1 goalie on field
      this.players.push(<Player increment_score={this.increment_score}/>);
    }
  }

  

  render () {
    return (
      <div className='recording'>
        <h1>Recoding Interface</h1>
        <Team name={this.team_name} score={this.goals_for} />
        <Team name={this.opp_name} score={this.goals_against} />
        {this.players}
        <Link to="/">
          <Button variant="contained">Dashboard</Button>
        </Link>
      </div>
    )
  }
}

export default Recording;
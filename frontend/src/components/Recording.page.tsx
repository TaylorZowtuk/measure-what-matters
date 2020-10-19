import React from "react";
import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import axios from "axios";

import Button from "@material-ui/core/Button";
import Team from "./Team";
import Bench from "./Bench";
import Field from "./Field";
import Player from "./Player";

type Goal = {
  id?: number;
  matchId: number;
  time: number;
  playerId: number;
  lineup: number[];
};

type RecordingProps = {};

class Recording extends React.Component<
  RecordingProps,
  {
    goals_against: number;
    goals_for: number;
    subField: Player | undefined; // Player to remove from field
    subBench: Player | undefined; // Player to add to field from bench
  }
> {
  team_name: string = "Blue Blazers";
  opp_name: string = "Red Rockets";

  constructor(props: RecordingProps) {
    super(props);
    this.state = {
      goals_for: 0,
      goals_against: 0,
      subField: undefined,
      subBench: undefined,
    };
  }

  setSubs = (
    subField: Player | undefined,
    subBench: Player | undefined
  ): void => {
    this.setState({ subField: subField, subBench: subBench });
  };

  incrementScore = (
    goal_for: boolean,
    scorer: Player,
    lineup: Player[]
  ): void => {
    if (goal_for) {
      this.setState({ goals_for: this.state.goals_for + 1 });
      // TODO: Uncomment, removed for demo
      // let ids: number[] = [];
      // for (let i = 0; i < lineup.length; i++) {
      //   ids.push(lineup[i].playerId);
      // }
      // let goal: Goal = {
      //   id: undefined,
      //   matchId: 1, // TODO: get matchid
      //   time: Date.now(), // Epoch time in ms
      //   playerId: scorer.playerId,
      //   lineup: ids,
      // };
      // console.log(goal);
      // axios.post(`/event/goals`, goal).then((res) => {
      //   console.log(res); // TODO: catch error and handle if needed
      // });
    } else {
      this.setState({ goals_against: this.state.goals_against + 1 });
      // TODO: add backend call to add against goal
    }
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="recording">
          <h1>Recording</h1>
          <Bench notifyOfSubs={this.setSubs}></Bench>
          <Team name={this.team_name} score={this.state.goals_for} />
          <Team name={this.opp_name} score={this.state.goals_against} />
          <Field
            incrementScore={this.incrementScore}
            removeFromField={this.state.subField}
            addToField={this.state.subBench}
            resetSubs={this.setSubs}
          />
          <Link to="/">
            <Button variant="contained">Dashboard</Button>
          </Link>
        </div>
      </DndProvider>
    );
  }
}

export default Recording;

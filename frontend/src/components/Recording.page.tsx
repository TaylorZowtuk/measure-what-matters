import React from "react";
import { Link } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Team from "./Team";
import Bench, { Substitution } from "./Bench";
import Field from "./Field";
import Player from "./Player";
import { time } from "console";

type Goal = {
  id?: number;
  matchId: number;
  time: number;
  playerId: number;
  lineup: number[];
};

type RecordingProps = {
  matchId: number;
  teamId: number;
};

class Recording extends React.Component<
  RecordingProps,
  {
    goals_against: number;
    goals_for: number;
    subField: Player | undefined; // Player to remove from field
    subBench: Player | undefined; // Player to add to field from bench
    roster: Player[]; // List of Players in this game for our team
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
      roster: [],
    };
  }

  getRoster = async (): Promise<Player[]> => {
    console.log("Requests roster");
    const res = await axios.get(`/player/teamId?teamId=${this.props.teamId}`);
    console.log("Gets roster response");
    console.log("Response data:", res.data);
    // TODO: handle error
    let players: Player[] = [];
    for (let i = 0; i < res.data.length; i++) {
      let first: string = res.data[i].name.split(/[ ,]+/, 1)[0];
      let last: string = res.data[i].name.split(/[ ,]+/, 1)[1];
      let player: Player = {
        first_name: first,
        last_name: last,
        num: res.data[i].jerseyNum,
        team: "ours",
        playerId: res.data[i].playerId,
      };
      players.push(player);
    }
    return players;
  };

  provideStartingLine = (): Player[] => {
    let starting: Player[] = this.state.roster.slice(0, 6); // First 6 players of roster are the starting lineup
    let body: any[] = [];
    for (let i = 0; i < starting.length; i++) {
      let sub: Substitution = {
        id: undefined,
        playerId: starting[i].playerId,
        matchId: 1, // TODO: dont hardcode matchid
        timeOn: Date.now(),
        timeOff: Date.now() + 10000, // TODO: have timeoff removed from endpoint
      };
      body.push(sub);
    }
    // TODO: make call to /event/substitutions/startingLineup endpoint
    return starting;
  };

  provideStartingBench = (): Player[] => {
    return this.state.roster.slice(6, this.state.roster.length); // All but first 6 players start on bench
  };

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
      let ids: number[] = [];
      for (let i = 0; i < lineup.length; i++) {
        ids.push(lineup[i].playerId);
      }
      let goal: Goal = {
        id: undefined,
        matchId: 1, // TODO: get matchid
        time: Date.now(), // Epoch time in ms
        playerId: scorer.playerId,
        lineup: ids,
      };
      console.log(goal);
      axios.post(`/event/goals`, goal).then((res) => {
        console.log(res); // TODO: catch error and handle if needed
      });
    } else {
      this.setState({ goals_against: this.state.goals_against + 1 });
      // TODO: add backend call to add against goal
    }
  };

  componentDidMount() {
    if (!this.state.roster.length) {
      this.getRoster().then((players: Player[]) => {
        this.setState({ roster: players });
      });
    }
  }

  render() {
    // If fetch request hasnt returned yet
    if (!this.state.roster.length) {
      return <h1>Loading...</h1>;
    } else {
      return (
        <DndProvider backend={HTML5Backend}>
          <div className="recording">
            <h1>Recording</h1>
            <Bench
              getStartingBench={this.provideStartingBench}
              notifyOfSubs={this.setSubs}
            ></Bench>
            <Team name={this.team_name} score={this.state.goals_for} />
            <Team name={this.opp_name} score={this.state.goals_against} />
            <Field
              getStartingLine={this.provideStartingLine}
              incrementScore={this.incrementScore}
              removeFromField={this.state.subField}
              addToField={this.state.subBench}
              resetSubs={this.setSubs}
            />
            <Link to="/dashboard">
              <Button variant="contained">Dashboard</Button>
            </Link>
          </div>
        </DndProvider>
      );
    }
  }
}

export default Recording;

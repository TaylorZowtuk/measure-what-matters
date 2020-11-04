import React from "react";
import { StaticContext } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Team from "./Team";
import Bench, { StartingPlayer } from "./Bench";
import Field from "./Field";
import Player from "./Player";
import authHeader from "../services/auth.header";

type Goal = {
  id?: number;
  matchId: number;
  time: number;
  playerId: number;
  lineup: number[];
};

type RecordingProps = {
  matchId: string;
  teamId: string;
};

class Recording extends React.Component<
  RouteComponentProps<{}, StaticContext, RecordingProps>,
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

  constructor(props: RouteComponentProps<{}, StaticContext, RecordingProps>) {
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
    const res = await axios.get(
      `/players/teamId?teamId=${this.props.location.state.matchId}`,
      { headers: authHeader() }
    );
    console.log("Get roster response:", res.data);
    // TODO: handle error
    let players: Player[] = [];
    for (let i = 0; i < res.data.length; i++) {
      let player: Player = {
        first_name: res.data[i].firstName,
        last_name: res.data[i].lastName,
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

    let lineupSubs: any[] = [];
    for (let i = 0; i < starting.length; i++) {
      let sub: StartingPlayer = {
        id: undefined,
        playerId: starting[i].playerId,
        matchId: Number(this.props.location.state.matchId),
        timeOn: Date.now(),
        timeOff: Date.now() + 10000, // TODO: have timeoff removed from endpoint
      };
      lineupSubs.push(sub);
    }
    axios
      .post(`/event/substitutions/startingLineup`, lineupSubs)
      .then((res) => {
        console.log("Post starting lineup response:", res); // TODO: catch error and handle if needed
      });
    console.log("Starting:", starting);
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
    scorer: Player | undefined = undefined,
    lineup: Player[] | undefined = undefined
  ): void => {
    if (goal_for) {
      if (scorer && lineup) {
        this.setState({ goals_for: this.state.goals_for + 1 });
        let ids: number[] = [];
        for (let i = 0; i < lineup.length; i++) {
          ids.push(lineup[i].playerId);
        }
        let goal: Goal = {
          matchId: Number(this.props.location.state.matchId),
          time: Date.now(), // Epoch time in ms
          playerId: scorer.playerId,
          lineup: ids,
        };
        axios
          .post(`/event/goals`, goal, { headers: authHeader() })
          .then((res) => {
            console.log(res); // TODO: catch error and handle if needed
          });
      }
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
          <h1>Recording</h1>
          <Bench
            matchId={Number(this.props.location.state.matchId)}
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
        </DndProvider>
      );
    }
  }
}

export default Recording;

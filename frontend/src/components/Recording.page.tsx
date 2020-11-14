import React from "react";
import { StaticContext } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Team from "./Team";
import Bench, { StartingPlayer } from "./Bench";
import Field from "./Field";
import Player from "./interfaces/player";
import authHeader from "../services/auth.header";
import CircularBuffer from "../util/circular-buffer";
import RecordingProps from "./interfaces/props/recording-props";

// Provide MatchId to each recording component which requires it through context
export const MatchIdContext: React.Context<number> = React.createContext(0);

type Goal = {
  id?: number;
  matchId: number;
  time: number;
  playerId: number | null;
  lineup: number[];
};

type CreateAssistDTO = {
  matchId: number;
  time: number;
  playerId: number;
};

class Recording extends React.Component<
  RouteComponentProps<{}, StaticContext, RecordingProps>,
  {
    goals_against: number;
    goals_for: number;
    subField: Player | undefined; // Player to remove from field
    subBench: Player | undefined; // Player to add to field from bench
    lineup: Player[]; // List of Players in this game for our team
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
      lineup: this.props.location.state.startingLineup,
    };
  }

  provideStartingLine = (): Player[] => {
    let starting: Player[] = this.state.lineup.slice(0, 6); // First 6 players of lineup are the starting lineup

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
      .post(`/event/substitutions/startingLineup`, lineupSubs, {
        headers: authHeader(),
      })
      .then((res) => {
        console.log("Post starting lineup response:", res); // TODO: catch error and handle if needed
      });
    return starting;
  };

  provideStartingBench = (): Player[] => {
    return this.state.lineup.slice(6, this.state.lineup.length); // All but first 6 players start on bench
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
    previousPossessions: CircularBuffer<number>,
    lineup: any[]
  ): void => {
    let ids: number[] = [];
    // Gather the player ids of all of our players on the field
    for (let i = 0; i < lineup.length; i++) {
      ids.push(lineup[i].props.player.playerId);
    }
    // Create a GoalDTO object
    let goal: Goal = {
      matchId: Number(this.props.location.state.matchId),
      time: Date.now(), // Epoch time in ms
      playerId: scorer.playerId !== -1 ? scorer.playerId : null,
      lineup: ids,
    };

    if (goal_for) {
      // Our goal
      // Update our score
      this.setState({ goals_for: this.state.goals_for + 1 });

      // Using the previousPossessions, automatically register an assist
      if (previousPossessions.size() >= 2) {
        // There was an assist
        // For indoor soccer, we only record one assister
        let assisterId: number | null = previousPossessions.dequeue();
        // We check size > 2 so should never be null
        if (assisterId && assisterId !== -1) {
          // The last possession wasnt the opposition
          let assist: CreateAssistDTO = {
            matchId: Number(this.props.location.state.matchId),
            time: Date.now(),
            playerId: assisterId,
          };
          axios
            .post(`/event/assists`, assist, { headers: authHeader() })
            .then((res) => {
              console.log("Post assist response:", res); // TODO: catch error and handle if needed
            });
        }
      }
    } else {
      // Opposing teams goal
      // Update their score
      this.setState({ goals_against: this.state.goals_against + 1 });
    }

    // Post to the goal endpoint
    axios.post(`/event/goals`, goal, { headers: authHeader() }).then((res) => {
      console.log("Post goal response:", res); // TODO: catch error and handle if needed
    });

    // On any goal, reset the previous possessions queue
    previousPossessions.clear();
  };

  deviceSupportsTouch(): boolean {
    // Dont catch laptops with touch
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  render() {
    // Determine if this is a mobile/tablet device in order to set appropriate dragndrop provider
    const useTouch = this.deviceSupportsTouch();

    return (
      <DndProvider backend={useTouch ? TouchBackend : HTML5Backend}>
        <MatchIdContext.Provider
          value={Number(this.props.location.state.matchId)}
        >
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
            <Button variant="contained">Finish Recording</Button>
          </Link>
        </MatchIdContext.Provider>
      </DndProvider>
    );
  }
}

export default Recording;

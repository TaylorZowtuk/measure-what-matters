import React from "react";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import axios from "axios";
import authHeader from "../../services/auth.header";

import Team from "./Team";
import Bench from "./Bench";
import Field from "./Field";
import Player from "../interfaces/player";
import CircularBuffer from "../../util/circular-buffer";
import RecordingProps from "../interfaces/props/recording-props";
import { Col, Row } from "react-bootstrap";
import { ShotFieldInfo, ShotResultPicker } from "./ShotResultPicker";
import { MatchStartDTO } from "../interfaces/matchStart";
import { StartingPlayerDTO } from "../interfaces/startingPlayer";
import Timer from "./Timer";
import { RecordingState } from "./State";

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
    shooting: boolean; // Whether we are in the, 'a shot is being taken' state
    shotFieldInfo: ShotFieldInfo | undefined; // A collection on field information passed to ShotResultPicker
  }
> {
  // Ref to timer child component for accessing timer methods
  timer: React.RefObject<Timer> = React.createRef<Timer>();
  // Ref to field child component for accessing possession methods
  field: React.RefObject<Field> = React.createRef<Field>();

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
      shooting: false,
      shotFieldInfo: undefined,
    };

    // Instantiate the global recording state instance
    window._recordingState = new RecordingState(
      Number(this.props.location.state.matchId)
    );

    // Make start match call
    let start: MatchStartDTO = {
      matchId: Number(this.props.location.state.matchId),
      time: Math.floor(Date.now() / 1000),
    };
    axios
      .post(`/match/start`, start, {
        headers: authHeader(),
      })
      .then((res) => {
        console.log("Post game start response:", res); // TODO: catch error and handle if needed
      });
  }

  provideStartingLine = (): Player[] => {
    let starting: Player[] = this.state.lineup.slice(0, 6); // First 6 players of lineup are the starting lineup

    let lineupSubs: any[] = [];
    for (let i = 0; i < starting.length; i++) {
      let sub: StartingPlayerDTO = {
        playerId: starting[i].playerId,
        matchId: Number(this.props.location.state.matchId),
        timeOn: 0,
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

  setShooting = (
    shooting: boolean = false,
    shotFieldInfo: ShotFieldInfo | undefined = undefined
  ): void => {
    if (shooting) {
      this.setState({ shooting: shooting, shotFieldInfo: shotFieldInfo });
    } else {
      this.setState({ shooting: shooting, shotFieldInfo: undefined });
    }
  };

  incrementScore = (
    goal_for: boolean,
    scorer: Player,
    previousPossessions: CircularBuffer<number>,
    lineup: any[]
  ): void => {
    // Stop the timer
    this.timer.current?.stopTimer();

    let ids: number[] = [];
    // Gather the player ids of all of our players on the field
    for (let i = 0; i < lineup.length; i++) {
      ids.push(lineup[i].props.player.playerId);
    }
    // Create a GoalDTO object
    let goal: Goal = {
      matchId: Number(this.props.location.state.matchId),
      time: window._recordingState.getCurrentTotalPlayTime(),
      // When playerId is null it is their goal
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
            time: window._recordingState.getCurrentTotalPlayTime(),
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

  wrapResetPlayers = () => {
    // If the ref to field has been set, call the resetPlayerWithPossession func
    if (this.field.current) {
      this.field.current.resetPlayerWithPossession();
    } // Else, if the ref to field hasnt been set yet, then do nothing
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
          <Row>
            <Col md="auto">
              <Team name={this.team_name} score={this.state.goals_for} />
            </Col>
            <Col md="auto">
              <Team name={this.opp_name} score={this.state.goals_against} />
            </Col>
          </Row>
          <Timer
            ref={this.timer}
            resetPossession={this.wrapResetPlayers}
            resetShootingState={this.setShooting}
          />
          <Bench
            getStartingBench={this.provideStartingBench}
            notifyOfSubs={this.setSubs}
            inShootingState={this.state.shooting}
          ></Bench>
          {this.state.shotFieldInfo ? (
            <ShotResultPicker
              shooting={this.state.shooting}
              propsIfGoal={{
                fieldInfo: this.state.shotFieldInfo,
                matchId: Number(this.props.location.state.matchId),
                incrementScore: this.incrementScore,
                exitShootingState: this.setShooting,
              }}
            />
          ) : null}

          <Field
            ref={this.field}
            matchId={Number(this.props.location.state.matchId)}
            getStartingLine={this.provideStartingLine}
            inShootingState={this.state.shooting}
            enterShootingState={this.setShooting}
            removeFromField={this.state.subField}
            addToField={this.state.subBench}
            resetSubs={this.setSubs}
          />
        </MatchIdContext.Provider>
      </DndProvider>
    );
  }
}

export default Recording;

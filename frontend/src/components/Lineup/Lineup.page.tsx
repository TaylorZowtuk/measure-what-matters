import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import CSS from "csstype";
import { RouteComponentProps } from "react-router-dom";
import Player from "../interfaces/player";
import RecordingProps from "../interfaces/props/recording-props";

const styling: CSS.Properties = {
  height: "100%",
  width: "100%",
  margin: "auto",
};

const tableStyling: CSS.Properties = {
  height: "70vh",
  width: "60vw",
  margin: "auto",
};

const textHeaderStyling: CSS.Properties = {
  marginTop: "10vh",
  marginBottom: "5vh",
};

const buttonStyling: CSS.Properties = {
  margin: "2vh",
};

interface StartingLineup {
  playerId: number;
  matchId: number;
  timeOn: number;
}

interface State {
  players: Player[];
  lineup: Player[];
  matchId: number;
  teamId: number;
}

class LineupComponent extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      players: [],
      lineup: [],
      matchId: 1,
      teamId: 1,
    };
  }

  componentDidMount() {
    this.getPlayers();
  }

  async getPlayers() {
    const res = await axios.get(`/players/teamId?teamId=${this.state.teamId}`, {
      headers: authHeader(),
    });
    this.setState({ players: res.data });
  }

  handleSelectedPlayer(
    event: React.ChangeEvent<HTMLInputElement>,
    playerId: number
  ) {
    const player = this.state.players.find(
      (player) => player.playerId === playerId
    );
    if (player) {
      if (event.target.checked) {
        this.state.lineup.push(player);
      } else {
        const ind = this.state.lineup.findIndex(
          (player) => player.playerId === playerId
        );
        this.state.lineup.splice(ind, 1);
      }
    }
  }

  async handleNextClicked() {
    if (this.state.lineup.length === 6) {
      const startingLineup: StartingLineup[] = [];
      const currentTime: number = Date.now();
      this.state.lineup.forEach((player) => {
        const lineupMember: StartingLineup = {
          playerId: player.playerId,
          timeOn: currentTime,
          matchId: this.state.matchId,
        };
        startingLineup.push(lineupMember);
      });
      await axios.post("event/substitutions/startingLineup", startingLineup, {
        headers: authHeader(),
      });
      const recordingState: RecordingProps = {
        matchId: this.state.matchId.toString(),
        teamId: this.state.teamId.toString(),
        startingLineup: this.state.lineup,
      };
      this.props.history.push("/recording", recordingState);
    } else {
      alert("Must select 6 players.");
    }
  }

  render() {
    return (
      <div className="Lineup" style={styling}>
        <h1 style={textHeaderStyling}>Choose Your Starting Lineup</h1>
        <TableContainer component={Paper} style={tableStyling}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Jersey Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.players.map((player) => (
                <TableRow key={player.playerId}>
                  <TableCell>
                    <Checkbox
                      onChange={(event) =>
                        this.handleSelectedPlayer(event, player.playerId)
                      }
                    />
                  </TableCell>
                  <TableCell>{player.firstName}</TableCell>
                  <TableCell>{player.lastName}</TableCell>
                  <TableCell>{player.jerseyNum}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          style={buttonStyling}
          onClick={() => {
            this.handleNextClicked();
          }}
          variant="contained"
        >
          Next
        </Button>
      </div>
    );
  }
}

export default LineupComponent;

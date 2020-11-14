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
import { RouteComponentProps, withRouter } from "react-router-dom";

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

interface Player {
  playerId: number;
  teamId: number;
  firstName: string;
  lastName: string;
  jerseyNum: number;
}

interface State {
  players: Player[];
  lineup: Player[];
}

interface RecordingState {
  teamId: number;
  matchId: number;
}

class LineupComponent extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      players: [],
      lineup: [],
    };
  }

  componentDidMount() {
    this.getPlayers();
  }

  async getPlayers() {
    const res = await axios.get(`/players/teamId?teamId=1`, {
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

  async handleNextClicked(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (this.state.lineup.length === 6) {
      await axios.post("substitutions/startingLineup", this.state.lineup);
      const recordingState: RecordingState = {
        matchId: 1,
        teamId: 1,
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
          onClick={(event) => {
            this.handleNextClicked(event);
          }}
          variant="contained"
        >
          Next
        </Button>
      </div>
    );
  }
}

export default withRouter(LineupComponent);

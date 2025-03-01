import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";
import { StaticContext } from "react-router";
import {
  Button,
  Checkbox,
  Container,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import CSS from "csstype";
import { Link, RouteComponentProps } from "react-router-dom";
import Player from "../interfaces/player";
import RecordingProps from "../interfaces/props/recording-props";
import LineupProps from "../interfaces/props/lineup-props";
import { CreateLineupDTO } from "../interfaces/createLineup";

const tableStyling: CSS.Properties = {
  height: "70vh",
};

const textHeaderStyling: CSS.Properties = {
  marginTop: "10vh",
  marginBottom: "5vh",
};

const buttonStyling: CSS.Properties = {
  margin: "2vh",
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface StartingLineup {
  playerId: number;
  matchId: number;
  timeOn: number;
}

interface State {
  players: Player[];
  lineup: Player[];
  numPlayerSnackbarOpen: boolean;
}

class LineupComponent extends React.Component<
  RouteComponentProps<{}, StaticContext, LineupProps>,
  State
> {
  constructor(props: RouteComponentProps<{}, StaticContext, LineupProps>) {
    super(props);
    this.state = {
      players: [],
      lineup: [],
      numPlayerSnackbarOpen: false,
    };
  }

  componentDidMount() {
    this.getPlayers();
  }

  async getPlayers() {
    axios
      .get(`/api/players/teamId?teamId=${this.props.location.state.teamId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        this.setState({ players: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
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

  openNumPlayersSnackbar = () => {
    this.setState({ numPlayerSnackbarOpen: true });
  };

  closeNumPlayersSnackbar = () => {
    this.setState({ numPlayerSnackbarOpen: false });
  };

  async handleNextClicked() {
    if (this.state.lineup.length >= 7) {
      const startingLineup: StartingLineup[] = [];
      const startingLineupPlayerIds: number[] = [];
      const currentTime: number = Date.now();
      this.state.lineup.forEach((player) => {
        const lineupMember: StartingLineup = {
          playerId: player.playerId,
          timeOn: currentTime,
          matchId: Number(this.props.location.state.matchId),
        };
        startingLineup.push(lineupMember);
        startingLineupPlayerIds.push(player.playerId);
      });
      const recordingState: RecordingProps = {
        matchId: this.props.location.state.matchId,
        teamId: this.props.location.state.teamId,
        startingLineup: this.state.lineup,
        ourTeamName: this.props.location.state.ourTeamName,
        oppTeamName: this.props.location.state.oppTeamName,
      };
      const matchLineup: CreateLineupDTO = {
        lineup: startingLineupPlayerIds,
        matchId: Number(this.props.location.state.matchId),
      };
      axios
        .post("/api/lineups", matchLineup, {
          headers: authHeader(),
        })
        .then((res) => {
          console.log("Post match lineup response:", res); // TODO: catch error and handle if needed
        });

      this.props.history.push("/match/recording", recordingState);
    } else {
      this.openNumPlayersSnackbar();
    }
  }

  render() {
    return (
      <Container>
        <h1 style={textHeaderStyling}>Choose Your Match Lineup</h1>
        <TableContainer component={Paper} style={tableStyling}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell align="center">Jersey Number</TableCell>
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
                  <TableCell align="center">{player.jerseyNum}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Link to="/matches/upcoming">
          <Button variant="contained" style={buttonStyling}>
            Back
          </Button>
        </Link>
        <Button
          style={buttonStyling}
          onClick={() => {
            this.handleNextClicked();
          }}
          variant="contained"
        >
          Next
        </Button>
        <Snackbar
          open={this.state.numPlayerSnackbarOpen}
          autoHideDuration={6000}
          onClose={this.closeNumPlayersSnackbar}
        >
          <Alert severity="error" onClose={this.closeNumPlayersSnackbar}>
            Must select at least 7 players.
          </Alert>
        </Snackbar>
      </Container>
    );
  }
}

export default LineupComponent;

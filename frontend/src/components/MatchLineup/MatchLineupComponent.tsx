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

class MatchLineupComponent extends React.Component<{}, State> {
  constructor(props: object) {
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
    console.log(this.state);
  }

  handleSelectedPlayer(
    event: React.ChangeEvent<HTMLInputElement>,
    playerId: number
  ) {
    const player = this.state.players.find(
      (player) => player.playerId === playerId
    );
    if (this.state.lineup.length < 6) {
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
      console.log(this.state.lineup);
    }
  }

  async handleSaveClicked(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (this.state.lineup.length === 6) {
      //TODO: Add a dialog to ask if they really want to save the lineup
      await axios.post(`/substitutions/startingLineup`, this.state.lineup);
    } else {
      alert("Must select 6 players.");
    }
  }

  render() {
    return (
      <TableContainer component={Paper} style={{ maxHeight: 500 }}>
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
        <Button
          onClick={(event) => {
            this.handleSaveClicked(event);
          }}
          variant="contained"
        >
          Save
        </Button>
      </TableContainer>
    );
  }
}

export default MatchLineupComponent;

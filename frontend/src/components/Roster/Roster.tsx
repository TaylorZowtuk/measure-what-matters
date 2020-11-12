import React, { ChangeEvent } from "react";
import authHeader from "../../services/auth.header";
import axios from "axios";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CSS from "csstype";
import CustomDialog from "../CustomDialog";

interface Player {
  playerId: number;
  teamId: number;
  firstName: string;
  lastName: string;
  jerseyNum: number;
}

interface Props {}

interface State {
  players: Player[];
  dialogOpen: boolean;
  playerToEdit: Player;
}

const tableStyling: CSS.Properties = {
  height: "50vh",
  width: "50vw",
  margin: "auto",
};

const defaultPlayer: Player = {
  playerId: -1,
  teamId: -1,
  firstName: "",
  lastName: "",
  jerseyNum: -1,
};

class Roster extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      players: [],
      dialogOpen: false,
      playerToEdit: defaultPlayer,
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

  handleEditClicked(player: Player) {
    console.log(player);
    this.setState({ dialogOpen: true, playerToEdit: player });
  }

  handleCancel = () => {
    this.setState({ dialogOpen: false, playerToEdit: defaultPlayer });
  };

  handleConfirmation = () => {
    const ind = this.state.players.findIndex(
      (player) => player.playerId === this.state.playerToEdit.playerId
    );
    if (ind > -1) {
      const editedPlayers = this.state.players;
      editedPlayers[ind] = this.state.playerToEdit;
      this.setState({
        players: editedPlayers,
        dialogOpen: false,
        playerToEdit: defaultPlayer,
      });
    }
  };

  dialogContents(player: Player): JSX.Element {
    return (
      <div>
        <TextField
          defaultValue={player.firstName}
          label="First Name"
          onChange={(e: any) => {
            const player = this.state.playerToEdit;
            player.firstName = e.target.value;
            this.setState({
              playerToEdit: player,
            });
          }}
        ></TextField>
        <TextField
          defaultValue={player.lastName}
          label="Last Name"
          onChange={(e: any) => {
            const player = this.state.playerToEdit;
            player.lastName = e.target.value;
            console.log(this.state);
            this.setState({
              playerToEdit: player,
            });
            console.log(this.state);
          }}
        ></TextField>
        <TextField
          defaultValue={player.jerseyNum}
          label="Jersey Number"
          onChange={(e: any) => {
            const player = this.state.playerToEdit;
            player.jerseyNum = e.target.value;
            this.setState({
              playerToEdit: player,
            });
          }}
        ></TextField>
      </div>
    );
  }

  render() {
    return (
      <div>
        <TableContainer component={Paper} style={tableStyling}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Jersey Number</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.players.map((player) => (
                <TableRow key={player.playerId} hover>
                  <TableCell>{player.firstName}</TableCell>
                  <TableCell>{player.lastName}</TableCell>
                  <TableCell>{player.jerseyNum}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        this.handleEditClicked({ ...player });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomDialog
          isOpen={this.state.dialogOpen}
          handleConfirmation={this.handleConfirmation}
          handleCancel={this.handleCancel}
          subtitle="Edit the player"
          confirmationButtonText="Save"
          denyButtonText="Cancel"
          children={this.dialogContents(this.state.playerToEdit)}
        ></CustomDialog>
      </div>
    );
  }
}

export default Roster;

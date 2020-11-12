import React from "react";
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
import DeleteIcon from "@material-ui/icons/Delete";
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
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  playerToAction: Player;
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

enum Actions {
  edit,
  delete,
}

class Roster extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      players: [],
      editDialogOpen: false,
      deleteDialogOpen: false,
      playerToAction: defaultPlayer,
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

  handleActionClicked(player: Player, action: Actions) {
    if (action === Actions.edit) {
      this.setState({ editDialogOpen: true, playerToAction: player });
    } else if (action === Actions.delete) {
      this.setState({ deleteDialogOpen: true, playerToAction: player });
    }
  }

  handleCancel = () => {
    this.setState({
      deleteDialogOpen: false,
      editDialogOpen: false,
      playerToAction: defaultPlayer,
    });
  };

  handleEditConfirmation = () => {
    const ind = this.state.players.findIndex(
      (player) => player.playerId === this.state.playerToAction.playerId
    );
    if (ind > -1) {
      const editedPlayers = this.state.players;
      editedPlayers[ind] = this.state.playerToAction;
      this.setState({
        players: editedPlayers,
        editDialogOpen: false,
        playerToAction: defaultPlayer,
      });
    }
  };

  handleDeleteConfirmation = () => {
    const ind = this.state.players.findIndex(
      (player) => player.playerId === this.state.playerToAction.playerId
    );
    if (ind > -1) {
      const editedPlayers = this.state.players;
      console.log(editedPlayers);
      editedPlayers.splice(ind, 1);
      console.log(editedPlayers);
      this.setState({
        players: editedPlayers,
        deleteDialogOpen: false,
        playerToAction: defaultPlayer,
      });
      console.log(this.state);
    }
  };

  editDialogContents(player: Player): JSX.Element {
    return (
      <div>
        <TextField
          defaultValue={player.firstName}
          label="First Name"
          onChange={(e: any) => {
            const player = this.state.playerToAction;
            player.firstName = e.target.value;
            this.setState({
              playerToAction: player,
            });
          }}
        ></TextField>
        <TextField
          defaultValue={player.lastName}
          label="Last Name"
          onChange={(e: any) => {
            const player = this.state.playerToAction;
            player.lastName = e.target.value;
            console.log(this.state);
            this.setState({
              playerToAction: player,
            });
            console.log(this.state);
          }}
        ></TextField>
        <TextField
          defaultValue={player.jerseyNum}
          label="Jersey Number"
          onChange={(e: any) => {
            const player = this.state.playerToAction;
            player.jerseyNum = e.target.value;
            this.setState({
              playerToAction: player,
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
                        this.handleActionClicked({ ...player }, Actions.edit);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        this.handleActionClicked({ ...player }, Actions.delete);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomDialog
          isOpen={this.state.editDialogOpen}
          handleConfirmation={this.handleEditConfirmation}
          handleCancel={this.handleCancel}
          subtitle="Edit the player"
          confirmationButtonText="Save"
          denyButtonText="Cancel"
          children={this.editDialogContents(this.state.playerToAction)}
        ></CustomDialog>
        <CustomDialog
          isOpen={this.state.deleteDialogOpen}
          handleConfirmation={this.handleDeleteConfirmation}
          handleCancel={this.handleCancel}
          subtitle={`Delete the player ${this.state.playerToAction.firstName} ${this.state.playerToAction.lastName}?`}
          confirmationButtonText="Delete"
          denyButtonText="Cancel"
        ></CustomDialog>
      </div>
    );
  }
}

export default Roster;

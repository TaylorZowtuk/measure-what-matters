import React from "react";
import authHeader from "../../services/auth.header";
import axios from "axios";
import {
  Button,
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
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import CSS from "csstype";
import CustomDialog from "../CustomDialog";
import { ThemeConsumer } from "react-bootstrap/esm/ThemeProvider";

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
  action: Actions;
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
  None,
  Edit,
  Delete,
  Add,
}

class Roster extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      players: [],
      editDialogOpen: false,
      deleteDialogOpen: false,
      playerToAction: defaultPlayer,
      action: Actions.None,
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
    if (action === Actions.Edit || action === Actions.Add) {
      this.setState({
        editDialogOpen: true,
        playerToAction: player,
        action: action,
      });
    } else if (action === Actions.Delete) {
      this.setState({
        deleteDialogOpen: true,
        playerToAction: player,
        action: action,
      });
    }
  }

  handleCancel = () => {
    this.setState({
      deleteDialogOpen: false,
      editDialogOpen: false,
      playerToAction: defaultPlayer,
    });
  };

  getTitle(action: Actions) {
    return `${Actions[action.valueOf()]} Player`;
  }

  handleEditConfirmation = () => {
    const ind = this.state.players.findIndex(
      (player) => player.playerId === this.state.playerToAction.playerId
    );
    const editedPlayers = this.state.players;

    if (ind > -1) {
      editedPlayers[ind] = this.state.playerToAction;
      this.setState({
        players: editedPlayers,
      });
    } else if (this.state.playerToAction.jerseyNum !== -1) {
      editedPlayers.push(this.state.playerToAction);
      this.setState({
        players: editedPlayers,
      });
    }
    this.setStateDefaults();
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
      });
      console.log(this.state);
    }
    this.setStateDefaults();
  };

  setStateDefaults() {
    this.setState({
      editDialogOpen: false,
      deleteDialogOpen: false,
      playerToAction: defaultPlayer,
      action: Actions.None,
    });
  }

  editDialogContents(player: Player): JSX.Element {
    return (
      <div>
        <TextField
          fullWidth
          autoFocus
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
          fullWidth
          style={{ marginTop: "30px" }}
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
          fullWidth
          style={{ marginTop: "30px", marginBottom: "30px" }}
          defaultValue={player.jerseyNum === -1 ? "" : player.jerseyNum}
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
                <TableCell>
                  <Button
                    variant="contained"
                    color="default"
                    endIcon={<PersonAddIcon />}
                    onClick={() => {
                      this.handleActionClicked(
                        { ...defaultPlayer },
                        Actions.Add
                      );
                    }}
                  >
                    Add Player
                  </Button>
                </TableCell>
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
                        this.handleActionClicked({ ...player }, Actions.Edit);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        this.handleActionClicked({ ...player }, Actions.Delete);
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
          title={this.getTitle(this.state.action)}
          confirmationButtonText="Save"
          denyButtonText="Cancel"
          children={this.editDialogContents(this.state.playerToAction)}
        ></CustomDialog>
        <CustomDialog
          isOpen={this.state.deleteDialogOpen}
          handleConfirmation={this.handleDeleteConfirmation}
          handleCancel={this.handleCancel}
          title={this.getTitle(this.state.action)}
          subtitle={`Are you sure you want to delete the player ${this.state.playerToAction.firstName} ${this.state.playerToAction.lastName}?`}
          confirmationButtonText="Delete"
          denyButtonText="Cancel"
        ></CustomDialog>
      </div>
    );
  }
}

export default Roster;

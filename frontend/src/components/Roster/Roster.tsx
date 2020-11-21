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
import { Link, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import RosterProps from "../interfaces/props/roster-props";
import Player from "../interfaces/player";
import CreatePlayerDTO from "../interfaces/createPlayer";

interface State {
  players: Player[];
  editDialogOpen: boolean;
  deleteDialogOpen: boolean;
  playerToAction: Player;
  action: Actions;
  teamId: number;
  invalidJerseyNumText: string;
  invalidFirstNameText: string;
  invalidLastNameText: string;
}

const tableStyling: CSS.Properties = {
  height: "70vh",
  width: "60vw",
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

const textHeaderStyling: CSS.Properties = {
  marginTop: "10vh",
  marginBottom: "5vh",
};

const buttonStyling: CSS.Properties = {
  margin: "2vh",
};

class Roster extends React.Component<
  RouteComponentProps<{}, StaticContext, RosterProps>,
  State
> {
  constructor(props: RouteComponentProps<{}, StaticContext, RosterProps>) {
    super(props);
    this.state = {
      players: [],
      editDialogOpen: false,
      deleteDialogOpen: false,
      playerToAction: defaultPlayer,
      action: Actions.None,
      teamId: props.location.state.teamId,
      invalidJerseyNumText: "",
      invalidFirstNameText: "",
      invalidLastNameText: "",
    };
  }

  componentDidMount() {
    this.getPlayers();
  }

  getPlayers = async () => {
    axios
      .get(`/players/teamId?teamId=${this.state.teamId}`, {
        headers: authHeader(),
      })
      .then((res) => {
        const players: Player[] = res.data;
        this.setState({
          players: players.sort((a, b) => (a.jerseyNum > b.jerseyNum ? 1 : -1)), // sort the players by the jersey num for easier viewing
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleActionClicked = (player: Player, action: Actions) => {
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
  };

  handleCancel = () => {
    this.setStateDefaults();
  };

  getTitle = (action: Actions) => {
    return `${Actions[action.valueOf()]} Player`;
  };

  handleEditConfirmation = () => {
    if (this.state.action === Actions.Edit) {
      axios
        .post("/players/edit", this.state.playerToAction, {
          headers: authHeader(),
        })
        .then(() => {
          this.getPlayers();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.state.action === Actions.Add) {
      const dto: CreatePlayerDTO = {
        teamId: this.state.teamId,
        firstName: this.state.playerToAction.firstName,
        lastName: this.state.playerToAction.lastName,
        jerseyNum: this.state.playerToAction.jerseyNum,
      };
      axios
        .post("/players", [dto], {
          headers: authHeader(),
        })
        .then(() => {
          this.getPlayers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.setStateDefaults();
  };

  handleDeleteConfirmation = () => {
    const ind = this.state.players.findIndex(
      (player) => player.playerId === this.state.playerToAction.playerId
    );
    if (ind > -1) {
      axios
        .delete(`/players?playerId=${this.state.playerToAction.playerId}`, {
          headers: authHeader(),
        })
        .then(() => {
          this.getPlayers();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.setStateDefaults();
  };

  setStateDefaults = () => {
    this.setState({
      editDialogOpen: false,
      deleteDialogOpen: false,
      playerToAction: defaultPlayer,
      action: Actions.None,
      invalidFirstNameText: "",
      invalidLastNameText: "",
      invalidJerseyNumText: "",
    });
  };

  editDialogContents = (player: Player): JSX.Element => {
    return (
      <div>
        <TextField
          fullWidth
          error={this.state.invalidFirstNameText.length === 0 ? false : true}
          helperText={this.state.invalidFirstNameText}
          autoFocus
          defaultValue={player.firstName}
          label="First Name"
          onChange={(e: any) => {
            let player: Player = { ...this.state.playerToAction };
            player.firstName = e.target.value;
            this.validateName(player);
          }}
        ></TextField>
        <TextField
          fullWidth
          error={this.state.invalidLastNameText.length === 0 ? false : true}
          helperText={this.state.invalidLastNameText}
          style={{ marginTop: "30px" }}
          defaultValue={player.lastName}
          label="Last Name"
          onChange={(e: any) => {
            let player: Player = { ...this.state.playerToAction };
            player.lastName = e.target.value;
            this.validateName(player);
          }}
        ></TextField>
        <TextField
          fullWidth
          error={this.state.invalidJerseyNumText.length === 0 ? false : true}
          helperText={this.state.invalidJerseyNumText}
          style={{ marginTop: "30px", marginBottom: "30px" }}
          defaultValue={player.jerseyNum === -1 ? "" : player.jerseyNum} // if default (-1) then we're adding a new player so leave field empty
          label="Jersey Number"
          onChange={(e: any) => {
            let player: Player = { ...this.state.playerToAction };
            player.jerseyNum = parseInt(e.target.value);
            this.validateJerseyNum(player);
          }}
        ></TextField>
      </div>
    );
  };

  disableSaveButton = () => {
    return (
      this.state.invalidJerseyNumText.length !== 0 ||
      this.state.invalidFirstNameText.length !== 0 ||
      this.state.invalidLastNameText.length !== 0
    );
  };

  validateName(playerToAction: Player) {
    const invalidNameWarning = "Enter a valid name with no spaces.";
    if (
      playerToAction.firstName !== "" &&
      playerToAction.firstName.indexOf(" ") === -1
    ) {
      this.setState({
        playerToAction: playerToAction,
        invalidFirstNameText: "",
      });
    } else {
      this.setState({
        playerToAction: playerToAction,
        invalidFirstNameText: invalidNameWarning,
      });
    }

    if (
      playerToAction.lastName !== "" &&
      playerToAction.lastName.indexOf(" ") === -1
    ) {
      this.setState({
        playerToAction: playerToAction,
        invalidLastNameText: "",
      });
    } else {
      this.setState({
        playerToAction: playerToAction,
        invalidLastNameText: invalidNameWarning,
      });
    }
  }

  validateJerseyNum(playerToAction: Player) {
    const invalidJerseyNumWarning: string =
      "Jersey number must be a number greater than 0.";
    const uniqueJerseyNumWarning: string = "Jersey number must be unique.";
    let uniqueJerseyNum: boolean = true;
    for (let player of this.state.players) {
      if (
        player.jerseyNum === playerToAction.jerseyNum &&
        player.playerId !== playerToAction.playerId
      ) {
        uniqueJerseyNum = false;
      }
    }
    if (
      !isNaN(playerToAction.jerseyNum) &&
      playerToAction.jerseyNum > 0 &&
      uniqueJerseyNum
    ) {
      this.setState({
        playerToAction: playerToAction,
        invalidJerseyNumText: "",
        invalidFirstNameText: "",
        invalidLastNameText: "",
      });
    } else {
      if (!uniqueJerseyNum) {
        this.setState({
          invalidJerseyNumText: uniqueJerseyNumWarning,
        });
      } else {
        this.setState({
          invalidJerseyNumText: invalidJerseyNumWarning,
        });
      }
    }
  }

  render() {
    return (
      <div>
        <h1 style={textHeaderStyling}>Edit Roster</h1>
        <TableContainer component={Paper} style={tableStyling}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell align="center">Jersey Number</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="default"
                    endIcon={<PersonAddIcon />}
                    onClick={() => {
                      this.handleActionClicked(defaultPlayer, Actions.Add);
                      this.validateJerseyNum(defaultPlayer); // to enable the helper text in the text field
                      this.validateName(defaultPlayer); // to enable the helper text in the text field
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
                  <TableCell align="center">{player.jerseyNum}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        this.handleActionClicked({ ...player }, Actions.Edit);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
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
        <Link to="/teams">
          <Button style={buttonStyling} variant="contained">
            Back
          </Button>
        </Link>
        <CustomDialog
          isOpen={this.state.editDialogOpen}
          handleConfirmation={this.handleEditConfirmation}
          handleCancel={this.handleCancel}
          title={this.getTitle(this.state.action)}
          confirmationButtonText="Save"
          denyButtonText="Cancel"
          children={this.editDialogContents(this.state.playerToAction)}
          disableConfirmationButton={this.disableSaveButton}
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

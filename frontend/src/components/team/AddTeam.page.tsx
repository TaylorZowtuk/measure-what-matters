import React from "react";
import TextField from "@material-ui/core/TextField";
import "./AddTeam.css";
import Button from "@material-ui/core/Button";
import Player from "./Player";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/auth.header";

interface createTeamState {
  teamName: string;
  playerList: newPlayer[];
  newPlayerFirstName: string;
  newPlayerLastName: string;
  newPlayerNumber: string;
  id: number;
  errorMessage: string;
}

interface newPlayer {
  firstName: string;
  lastName: string;
  number: string;
  id: number;
}

class AddTeam extends React.Component<{}, createTeamState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      teamName: "",
      playerList: [],
      newPlayerFirstName: "",
      newPlayerLastName: "",
      newPlayerNumber: "",
      id: 0,
      errorMessage: "",
    };
  }

  /* handle input changes */
  handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      teamName: e.target.value,
    });
  };

  handlePlayerFirstNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({
      newPlayerFirstName: e.target.value,
    });
  };

  handlePlayerLastNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({
      newPlayerLastName: e.target.value,
    });
  };

  handlePlayerNumberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      newPlayerNumber: e.target.value,
    });
  };

  // add player to the team list
  onAddPlayer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    e.preventDefault();
    this.setState({ errorMessage: "" });
    // check if both first name and last name are entered
    if (
      this.state.newPlayerFirstName?.trim() === "" ||
      this.state.newPlayerLastName?.trim() === ""
    ) {
      this.setState({ errorMessage: "Please enter both first and last name" });
      return;
    }
    // check if player number is valid
    if (
      isNaN(Number(this.state.newPlayerNumber)) ||
      this.state.newPlayerNumber === "" ||
      !Number.isInteger(Number(this.state.newPlayerNumber)) ||
      Number(this.state.newPlayerNumber) < 0
    ) {
      this.setState({ errorMessage: "Please enter a valid player number" });
      return;
    }
    if (
      this.state.newPlayerFirstName?.trim() !== "" &&
      this.state.newPlayerLastName?.trim() !== "" &&
      !isNaN(Number(this.state.newPlayerNumber)) &&
      this.state.newPlayerNumber !== ""
    ) {
      const index = this.state.playerList.findIndex(
        (oldPlayer) => this.state.newPlayerNumber.trim() === oldPlayer.number
      );
      if (index === -1) {
        let incrementId = this.state.id + 1;
        this.setState({
          playerList: [
            ...this.state.playerList,
            {
              firstName: this.state.newPlayerFirstName,
              lastName: this.state.newPlayerLastName,
              number: this.state.newPlayerNumber.trim(),
              id: this.state.id,
            },
          ],
          newPlayerFirstName: "",
          newPlayerLastName: "",
          newPlayerNumber: "",
          id: incrementId,
        });
      }
    }
  };

  // remove player from the team list
  onRemovePlayer = (player: newPlayer) => {
    const index = this.state.playerList.findIndex(
      (oldPlayer) => player.id === oldPlayer.id
    );
    if (index > -1) {
      const oldList = this.state.playerList;
      oldList.splice(index, 1);
      this.setState({
        playerList: oldList,
      });
    }
  };

  // handles when add team button is pressed
  onAddTeam = () => {
    this.setState({ errorMessage: "" });
    //TODO: add new team to database
    if (this.state.teamName.trim() !== "") {
      axios
        .post(
          "/api/teams",
          { name: this.state.teamName },
          { headers: authHeader() }
        )
        .then(
          (response) => {
            console.log("team name pass");
            if (response.data.teamId) {
              if (this.state.playerList.length !== 0) {
                let playerArray: Array<{
                  teamId: number;
                  firstName: string;
                  lastName: string;
                  jerseyNum: number;
                }> = [];
                this.state.playerList.map((player: newPlayer) => {
                  playerArray.push({
                    teamId: response.data.teamId,
                    firstName: player.firstName,
                    lastName: player.lastName,
                    jerseyNum: Number(player.number),
                  });
                  return null;
                });
                console.log(playerArray);
                axios
                  .post("/api/players", playerArray, { headers: authHeader() })
                  .then(
                    (response) => {
                      console.log("team added successfully");
                      this.setState({
                        teamName: "",
                        playerList: [],
                        newPlayerFirstName: "",
                        newPlayerLastName: "",
                        newPlayerNumber: "",
                        id: 0,
                      });
                    },
                    (error) => {
                      console.log("unsuccessful team creation");
                    }
                  );
              } else {
                console.log("add team");
                this.setState({
                  teamName: "",
                  playerList: [],
                  newPlayerFirstName: "",
                  newPlayerLastName: "",
                  newPlayerNumber: "",
                  id: 0,
                });
              }
            } else {
              console.log(response.data);
            }
          },
          (error) => {
            console.log("team not created");
            this.setState({ errorMessage: error.response.data.message });
            console.log(error.response);
          }
        );
    } else {
      this.setState({ errorMessage: "Enter team name" });
    }
  };

  render() {
    return (
      <div className="container">
        <p
          style={{
            color: "crimson",
            fontSize: 14,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {this.state.errorMessage}
        </p>
        <h3>Add A New Team</h3>
        <TextField
          required
          id="outlined-required"
          label="Team Name"
          variant="outlined"
          margin="dense"
          onChange={this.handleTeamNameChange}
          value={this.state.teamName}
        />
        <h3>{this.state.teamName}</h3>
        <form
          style={{
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <TextField
            style={{ marginRight: 10 }}
            id="outlined-required"
            label="Player First Name"
            variant="outlined"
            margin="dense"
            value={this.state.newPlayerFirstName}
            onChange={this.handlePlayerFirstNameChange}
          />

          <TextField
            style={{ marginRight: 10 }}
            id="outlined-required"
            label="Player Last Name"
            variant="outlined"
            margin="dense"
            value={this.state.newPlayerLastName}
            onChange={this.handlePlayerLastNameChange}
          />

          <TextField
            style={{ marginRight: 10 }}
            id="outlined-required"
            label="Player Number"
            variant="outlined"
            margin="dense"
            value={this.state.newPlayerNumber}
            onChange={this.handlePlayerNumberChange}
          />
          <br />
          <div>
            <Button variant="contained" onClick={this.onAddPlayer}>
              ADD PLAYER
            </Button>
          </div>
        </form>
        <table style={{ margin: "20px auto" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px" }}>Player Name</th>
              <th style={{ padding: "10px" }}>Player Number</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.playerList.map((player) => {
              return (
                <Player
                  player={player}
                  onRemove={this.onRemovePlayer}
                  key={player.number}
                ></Player>
              );
            })}
          </tbody>
        </table>
        <Button
          variant="contained"
          style={{ marginBottom: 10 }}
          onClick={this.onAddTeam}
        >
          Add Team
        </Button>
        <br />
        <Link to="/teams">
          <Button variant="contained">Back</Button>
        </Link>
      </div>
    );
  }
}

export default AddTeam;

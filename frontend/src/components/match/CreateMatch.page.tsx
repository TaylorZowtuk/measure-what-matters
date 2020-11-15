import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";

interface matchState {
  teamId: number | unknown;
  opponent: string;
  isHomeTeam: boolean;
  scheduledTime: string;
  time: number;
  teams: { name: string; teamId: number }[];
  errorMessage: string;
}

class CreateMatch extends React.Component<{}, matchState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      teamId: -1,
      opponent: "",
      isHomeTeam: true,
      scheduledTime: "",
      time: Date.parse("2020-11-01T10:30"),
      teams: [],
      errorMessage: "",
    };

    //get all teams
    axios.get("/teams", { headers: authHeader() }).then((response) => {
      if (response.data) {
        console.log(response.data);
        this.setState({ teams: response.data });
        console.log(this.state.teams);
      }
    });
  }

  handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ time: Date.parse(e.target.value) });
  };

  handleHomeTeamChange = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    if (e.target.value === 1) {
      this.setState({ isHomeTeam: true });
    } else {
      this.setState({ isHomeTeam: false });
    }
  };

  handleOpponentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ opponent: event.target.value });
  };

  handleTeamChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    this.setState({ teamId: event.target.value });
  };

  onCreateMatch = () => {
    if (this.state.teamId === -1) {
      this.setState({ errorMessage: "Please select a team" });
    } else if (this.state.opponent.trim() === "") {
      this.setState({ errorMessage: "Please enter opponent name" });
    } else {
      //TODO: make post request
      console.log("create match");
      window.location.href = "/dashboard";
    }
  };

  render() {
    return (
      <div>
        <h3>Create Match</h3>
        <form
          style={{
            backgroundColor: "whitesmoke",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "left",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "crimson",
                fontSize: 14,
                width: "25ch",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {this.state.errorMessage}
            </p>
          </div>
          <FormControl style={{ minWidth: "100%" }}>
            <InputLabel id="demo-simple-select-label">Team</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.teamId}
              onChange={this.handleTeamChange}
            >
              {this.state.teams.map((team) => {
                return (
                  <MenuItem value={team.teamId} key={team.teamId}>
                    {team.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <TextField
            id="standard-basic"
            label="Opponent Name"
            style={{ minWidth: "100%" }}
            onChange={this.handleOpponentChange}
            value={this.state.opponent}
          ></TextField>
          <br />
          <FormControl style={{ minWidth: "100%" }}>
            <InputLabel id="demo-simple-select-label">Game Venue</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.isHomeTeam ? 1 : 0}
              onChange={this.handleHomeTeamChange}
            >
              <MenuItem value={1}>Home</MenuItem>
              <MenuItem value={0}>Away</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField
            id="datetime-local"
            label="When"
            type="datetime-local"
            defaultValue="2020-11-01T10:30"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.handleTimeChange}
          />
          <br />
          <Button
            variant="contained"
            style={{ marginLeft: "auto", marginRight: "auto", width: "100%" }}
            onClick={this.onCreateMatch}
          >
            Create Team
          </Button>
        </form>
      </div>
    );
  }
}

export default CreateMatch;

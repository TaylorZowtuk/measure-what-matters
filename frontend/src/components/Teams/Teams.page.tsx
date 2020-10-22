import React from "react";
import TeamComponent from "../TeamComponent/TeamComponent";
import Button from "@material-ui/core/Button";
import "./teams.css";
import { Link } from "react-router-dom";
// import axios from "axios";

interface teamState {
  teamList: Team[];
}

interface Team {
  teamName: string;
  playerList: Player[];
}

interface Player {
  name: string;
  number: number;
}

class Teams extends React.Component<{}, teamState> {
  constructor(props: {}) {
    super(props);
    // TODO: make request to retrieve team list

    this.state = {
      teamList: [
        {
          teamName: "Boys Team",
          playerList: [
            {
              name: "John",
              number: 1,
            },
            {
              name: "Tom",
              number: 2,
            },
            {
              name: "Bob",
              number: 3,
            },
          ],
        },
        {
          teamName: "Girls Team",
          playerList: [
            {
              name: "Cat",
              number: 5,
            },
            {
              name: "Lily",
              number: 6,
            },
            {
              name: "Mag",
              number: 8,
            },
          ],
        },
      ],
    };
  }

  public render() {
    return (
      <div className="container">
        <h3>Your Teams</h3>
        {this.state.teamList.map((team) => {
          return (
            <div className="teamList">
              <p>{team.teamName}</p>
              <TeamComponent playerList={team.playerList}></TeamComponent>
              {/* <Button variant="contained">Edit Team</Button> */}
            </div>
          );
        })}
        <Link to="/create-team">
          <Button variant="contained" style={{ marginBottom: 10 }}>
            Add Team
          </Button>
        </Link>
        <br />
        <Link to="/dashboard">
          <Button variant="contained">Dashboard</Button>
        </Link>
      </div>
    );
  }
}

export default Teams;

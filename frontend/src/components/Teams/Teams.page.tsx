import React from "react";
import TeamComponent from "../TeamComponent/TeamComponent";
import Button from "@material-ui/core/Button";
import "./teams.css";
import { Link } from "react-router-dom";
import axios from "axios";
// import AuthService from "../../services/auth.service";

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

// const currentUser = AuthService.getCurrentUser();

class Teams extends React.Component<{}, teamState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      teamList: []
    }
    // TODO: make request to retrieve team list
    axios.get(`/teams/userId?userId=0`)
    .then(response => {
      let teams = response.data;
      let teamArray: Team[] = [];

      teams.forEach((element: any) => {
        axios.get(`/player/teamId?teamId=${element.teamId}`)
        .then(response => {
          let players: Array<Player> = [];
          response.data.playerArray.forEach((player: any) => {
            players.push({name: player.name, number: player.jerseyNum});
          });
          teamArray.push({teamName: element.name, playerList: players});
          this.setState({teamList: teamArray});
        },
        (error) => {
          console.log("getting errors");
        });
      });
    },
    (error) => {
      console.log("getting errors");
    })

  //   this.state = {
  //     teamList: [
  //       {
  //         teamName: "Boys Team",
  //         playerList: [
  //           {
  //             name: "John",
  //             number: 1,
  //           },
  //           {
  //             name: "Tom",
  //             number: 2,
  //           },
  //           {
  //             name: "Bob",
  //             number: 3,
  //           },
  //         ],
  //       },
  //       {
  //         teamName: "Girls Team",
  //         playerList: [
  //           {
  //             name: "Cat",
  //             number: 5,
  //           },
  //           {
  //             name: "Lily",
  //             number: 6,
  //           },
  //           {
  //             name: "Mag",
  //             number: 8,
  //           },
  //         ],
  //       },
  //     ],
  //   };
  }

  public render() {
    return (
      <div className="container">
        <h3>Your Teams</h3>
        {
        this.state.teamList.map((team) => {
          return (
            <div className="teamList">
              <p>{team.teamName}</p>
              <TeamComponent playerList={team.playerList}></TeamComponent>
              {/* <Button variant="contained">Edit Team</Button> */}
            </div>
          );
        })
        }
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

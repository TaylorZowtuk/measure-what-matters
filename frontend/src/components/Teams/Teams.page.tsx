import React from "react";
import TeamComponent from "../TeamComponent/TeamComponent";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/auth.header";
// import AuthService from "../../services/auth.service";
import { Container, Row, Col } from "react-bootstrap";

interface teamState {
  teamList: Team[];
}

interface Team {
  teamName: string;
  playerList: Player[];
  teamId: number;
}

interface Player {
  firstName: string;
  lastName: string;
  number: number;
  playerId: number;
}

// const currentUser = AuthService.getCurrentUser();

class Teams extends React.Component<{}, teamState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      teamList: []
    }
    // TODO: make request to retrieve team list
    axios.get(`/teams`, { headers: authHeader() })
    .then(response => {
      console.log("got teams");
      console.log(response.data);
      let teams = response.data;
      let teamArray: Team[] = [];

      teams.forEach((element: any) => {
        axios.get(`/players/teamId?teamId=${element.teamId}`, { headers: authHeader() })
        .then(response => {
          let players: Array<Player> = [];
          if(response.data) 
            {response.data.forEach((player: any) => {
              players.push({firstName: player.firstName, lastName: player.lastName, number: player.jerseyNum, playerId: player.playerId});
            });}
          teamArray.push({teamName: element.name, playerList: players, teamId: element.teamId});
          this.setState({teamList: teamArray});
        },
        (error) => {
          console.log("getting errors");
          console.log(error);
        });
      });
    },
    (error) => {
      console.log("getting errors");
      console.log(localStorage.getItem("user"));
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
      <Container>
        <h3>Your Teams</h3>
        {
        this.state.teamList.map((team) => {
          return (
            <Row key={team.teamId.toString()}>
              <Col>
                {team.teamName}
                <TeamComponent playerList={team.playerList}></TeamComponent>
                {/* <Button variant="contained">Edit Team</Button> */}
              </Col>
            </Row>
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
      </Container>
    );
  }
}

export default Teams;

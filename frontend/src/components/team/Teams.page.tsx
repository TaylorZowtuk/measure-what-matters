import React from "react";
import TeamComponent from "./TeamComponent";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/auth.header";
import { Container, Row, Col } from "react-bootstrap";
import RosterProps from "../interfaces/props/roster-props";

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

const rosterProps: RosterProps = {
  teamId: 1,
};

class Teams extends React.Component<{}, teamState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      teamList: [],
    };
    axios.get(`/teams`, { headers: authHeader() }).then(
      (response) => {
        console.log("got teams");
        console.log(response.data);
        let teams = response.data;
        let teamArray: Team[] = [];

        teams.forEach((element: any) => {
          axios
            .get(`/players/teamId?teamId=${element.teamId}`, {
              headers: authHeader(),
            })
            .then(
              (response) => {
                let players: Array<Player> = [];
                if (response.data) {
                  response.data.forEach((player: any) => {
                    players.push({
                      firstName: player.firstName,
                      lastName: player.lastName,
                      number: player.jerseyNum,
                      playerId: player.playerId,
                    });
                  });
                }
                teamArray.push({
                  teamName: element.name,
                  playerList: players,
                  teamId: element.teamId,
                });
                this.setState({ teamList: teamArray });
              },
              (error) => {
                console.log("getting errors");
                console.log(error);
              }
            );
        });
      },
      (error) => {
        console.log("getting errors");
        console.log(localStorage.getItem("user"));
      }
    );
  }

  public render() {
    return (
      <Container>
        <h3>Your Teams</h3>
        {this.state.teamList.map((team) => {
          return (
            <Row key={team.teamId.toString()}>
              <Col>
                {team.teamName}
                <TeamComponent playerList={team.playerList}></TeamComponent>
                <Link
                  to={{
                    pathname: "/teams/roster",
                    state: rosterProps,
                  }}
                >
                  <Button
                    style={{ marginTop: "10px", marginBottom: "35px" }}
                    variant="contained"
                  >
                    Edit Roster
                  </Button>
                </Link>
              </Col>
            </Row>
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
      </Container>
    );
  }
}

export default Teams;

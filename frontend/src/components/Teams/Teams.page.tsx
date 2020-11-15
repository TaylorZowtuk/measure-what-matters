import React from "react";
import TeamComponent from "../TeamComponent/TeamComponent";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
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
  name: string;
  number: number;
  playerId: number;
}

const rosterProps: RosterProps = {
  teamId: 1,
};

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
              playerId: 1,
            },
            {
              name: "Tom",
              number: 2,
              playerId: 2,
            },
            {
              name: "Bob",
              number: 3,
              playerId: 3,
            },
          ],
          teamId: 1,
        },
        {
          teamName: "Girls Team",
          playerList: [
            {
              name: "Cat",
              number: 5,
              playerId: 4,
            },
            {
              name: "Lily",
              number: 6,
              playerId: 5,
            },
            {
              name: "Mag",
              number: 8,
              playerId: 6,
            },
          ],
          teamId: 2,
        },
      ],
    };
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

import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";

interface Player {
  playerId: number;
  teamId: number;
  firstName: string;
  lastName: string;
  jerseyNum: number;
}

interface State {
  players: Player[];
}

class MatchLineupComponent extends React.Component<{}, State> {
  constructor() {
    super({});
    this.state = {
      players: [],
    };
  }

  async getPlayers(): Promise<Player[]> {
    const res = await axios.get(`/players/teamId?teamId=1`, {
      headers: authHeader(),
    });
    return res.data;
  }

  componentDidMount() {
    this.getPlayers().then((players) => {
      this.setState({ players: players });
    });
  }

  render() {
    return <div></div>;
  }
}

export default MatchLineupComponent;

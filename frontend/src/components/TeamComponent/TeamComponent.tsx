import React from "react";
import "./teamComponent.css";

interface teamProps {
  playerList: Player[];
}

interface Player {
  firstName: string;
  lastName: string;
  number: number;
  playerId: number;
}

class TeamComponent extends React.Component<teamProps> {
  public render() {
    return (
      <table style={{margin:"10px auto", color:"#282c34"}}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Jersey Number</th>
          </tr>
        </thead>
        <tbody>
          {this.props.playerList.map((player: Player) => {
            return (
              <tr key={player.playerId}>
                <td>{player.firstName}</td>
                <td>{player.lastName}</td>
                <td>{player.number}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default TeamComponent;

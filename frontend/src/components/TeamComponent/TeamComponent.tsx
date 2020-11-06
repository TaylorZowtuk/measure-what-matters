import React from "react";
import "./teamComponent.css";

interface teamProps {
  playerList: Player[];
}

interface Player {
  name: string;
  number: number;
  playerId: number;
}

class TeamComponent extends React.Component<teamProps> {
  public render() {
    return (
      <div className="team">
        {this.props.playerList.map((player: Player) => {
          return (
            <h3>
              {player.name} {player.number}
            </h3>
          );
        })}
      </div>
    );
  }
}

export default TeamComponent;

import React from "react";

type TeamProps = {
  name: string;
  score: number;
};

class Team extends React.Component<TeamProps> {
  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <h1>{this.props.score}</h1>
      </div>
    );
  }
}

export default Team;

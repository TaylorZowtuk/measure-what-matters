import React from 'react';
import './teamComponent.css'

interface teamProps{
    playerList: Player[]
}

interface Player{
    name: string;
    number: number;
}

class TeamComponent extends React.Component<teamProps>{
    constructor(props: teamProps) {
        super(props);
    }

    public render(){
        return (
            <div className="team">
                {
                    this.props.playerList.map((player: Player) => {
                        return (
                            <div className="player">
                                <h3>{player.name} {player.number}</h3>
                            </div>
                        )
                        })
                    }
            </div>
        );
    }
}

export default TeamComponent;

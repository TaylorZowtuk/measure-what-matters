import React from 'react';
import './Lineup.css'

interface Lineup {
    playerList: {name: string}[]
}

class LineupComponent extends React.Component<Lineup> {
    render() {
        return (
            <div className="container">
                {
                    this.props.playerList.map((player) => {
                        return(
                            <p className="player">{player.name}</p>
                        );
                    })
                }
            </div>
        )
    }
}

export default LineupComponent;
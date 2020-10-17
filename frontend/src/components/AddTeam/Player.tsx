import React from 'react';

interface PlayerProps {
    player: newPlayer;
    onRemove: (player: newPlayer) => void;
}

interface newPlayer {
    name: string;
    number: string;
    id: number;
}

class Player extends React.Component<PlayerProps> {
    constructor(props: PlayerProps){
        super(props);
        this.removePlayer = this.removePlayer.bind(this);
    }

    removePlayer = () => {
        this.props.onRemove(this.props.player);
    }

    render() {
        return (
            <tr>
                <td>{this.props.player.name}</td>
                <td>{this.props.player.number}</td>
                <td><button onClick={this.removePlayer}>remove</button></td>
            </tr>
        )
    }
}

export default Player;
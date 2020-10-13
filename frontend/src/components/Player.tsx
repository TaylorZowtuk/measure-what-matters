import React from 'react';
import Draggable from "react-draggable";
import Button from '@material-ui/core/Button';

type PlayerProps = {
    increment_score:Function
  };

class Player extends React.Component<PlayerProps> {
    // TODO: fix clicking a button resulting in a score increment
    onStop = () => {
        this.props.increment_score(false);
        // TODO: make call to backend to add goal
    }
    render () {
        return(
        <div className='player'>
            <Draggable position={{x: 0, y: 0}} onStop={this.onStop}>
                <Button variant="contained">Player 1</Button>
            </Draggable>
        </div>
        )
    }
}

export default Player;

import React from 'react';
import Draggable from "react-draggable";
import Button from '@material-ui/core/Button';

class Player extends React.Component {
    render () {
        return(
        <div className='player'>
            <Draggable position={{x: 0, y: 0}}>
                <Button variant="contained">Player 1</Button>
            </Draggable>
        </div>
        )
    }
}

export default Player;

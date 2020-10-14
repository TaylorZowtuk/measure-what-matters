import React from 'react';
import { useDrag } from 'react-dnd'
import { DraggableTypes } from '../constants'
import Button from '@material-ui/core/Button';


type PlayerProps = {
    increment_score:Function
  };

function Player(props: PlayerProps) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: DraggableTypes.PLAYER },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
    })

    // TODO: fix clicking a button resulting in a score increment
    // onStop = () => {
    //     props.increment_score(false);
    //     // TODO: make call to backend to add goal
    // }

    return( // TODO: fix the artifacts in the drag preview
        <div ref={drag}>
            <Button variant="contained">Player 1</Button>
        </div>
    )
}

export default Player;

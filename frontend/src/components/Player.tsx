import React from 'react';
import { useDrag } from 'react-dnd'
import { DraggableTypes } from '../constants'
import Button from '@material-ui/core/Button';


type PlayerProps = {
  };

function Player(props: PlayerProps) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: DraggableTypes.PLAYER },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
    })

    return( // TODO: fix the artifacts in the drag preview
        <div ref={drag}>
            <Button variant="contained">Player 1</Button>
        </div>
    )
}

export default Player;

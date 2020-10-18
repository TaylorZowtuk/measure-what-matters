import React from 'react';
import { DragSourceHookSpec, useDrag } from 'react-dnd'
import { DraggableTypes } from '../constants'
import Button from '@material-ui/core/Button';


type PlayerProps = {
    identifier:string,
    number:number,
    team:string
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
            <Button variant="contained">{props.identifier} {(props.number != -1) ? (props.number) : ""}</Button>
        </div>
    )
}

export default Player;

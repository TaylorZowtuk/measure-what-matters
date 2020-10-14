import React from 'react';
import { useDrag } from 'react-dnd'
import { DraggableTypes } from '../constants'
import Button from '@material-ui/core/Button';


type PlayerProps = {
    identifier:string,
    number:number,
    team:string
};

function Player(props: PlayerProps) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: DraggableTypes.PLAYER, team: props.team },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            // doneDragging : !!monitor.getDropResult()
        })
    })

    return( // TODO: fix the artifacts in the drag preview
        <div ref={drag}>
            <Button variant="contained">{props.identifier} {(props.number != -1) ? (props.number) : ""}</Button>
        </div>
    )
}

export default Player;

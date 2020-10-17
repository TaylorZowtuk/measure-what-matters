import React from 'react';
import { DraggableTypes } from '../constants';
import { DropTargetMonitor, useDrop } from 'react-dnd'



function Bench() {
    const [, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: (item: any, monitor: DropTargetMonitor) => {
            console.log(item.team)
        }
    })

    return (
        <div ref={drop} id="bench">Bench Area</div>
    );
}


export default Bench;
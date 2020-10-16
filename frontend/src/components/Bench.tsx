import React from 'react';
import { DraggableTypes } from '../constants';
import { useDrop } from 'react-dnd'

type BenchProps = {
};


function Bench(props: BenchProps) {
    const [{isOver}, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: () => console.log("dropped in bench"),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
          })
    })

    return (
        <div ref={drop} id="bench">Bench Area</div>
    );
}


export default Bench;
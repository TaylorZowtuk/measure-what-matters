import React from 'react';
import { DraggableTypes } from '../constants';
import { useDrop } from 'react-dnd'

type FieldProps = {
    players:any[]
};


function Field(props: FieldProps) {
    const [{isOver}, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: () => console.log("dropped in field"),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
          })
    })


    return (
        <div ref={drop} id="Field">
            {props.players.map((player, index) => (
                <div className="player" key={index}>{player}</div>
          ))}
        </div>
    );
}


export default Field;
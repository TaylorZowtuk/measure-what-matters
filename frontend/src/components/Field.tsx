import React from 'react';
import { DraggableTypes } from '../constants';
import { useDrop } from 'react-dnd'

type FieldProps = {
    players:any[],
    increment_score:Function
};


function Field(props: FieldProps) {
    const [{isOver}, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: () => props.increment_score(true),
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
import React from 'react';
import { DraggableTypes } from '../constants';
import { DragSourceHookSpec, useDrop } from 'react-dnd'

import Player from './Player';

type FieldProps = {
    players:any[],
    increment_score:Function
};


function Field(props: FieldProps) {
    const [{isOver}, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: (item, monitor) => props.increment_score(true)
        // drop: (item, monitor) => {props.increment_score(     // TODO: increment correct teams score
        //     (monitor.team == "ours") ? true : false 
        // )},
    })

    return (
        <div ref={drop} id="Field">
            {props.players.map((player, index) => (
                <div className="player" key={index}>{player}</div>
          ))}
          {/* Opposing team number is null*/}
          {/* <Player identifier="Bad Guys" number={-1} team="theirs"/>  */}
        </div>
    );
}


export default Field;
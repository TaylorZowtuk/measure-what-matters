import React from 'react';
import { DraggableTypes } from '../constants';
import { useDrop } from 'react-dnd'

import Player from './Player';

type FieldProps = {
    players:any[],
    increment_score:Function
};


function Field(props: FieldProps) {
    const [{isOver}, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: (item, monitor) => props.increment_score(true),   // TODO: increment correct teams score
        // {props.increment_score(
        //     (item.team == "ours") ? true : false 
        // )},
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    })

    return (
        <div ref={drop} id="Field">
            {props.players.map((player, index) => (
                <div className="player" key={index}>{player}</div>
          ))}
          <Player identifier="Bad Guys" number={-1} team="theirs"/> {/* Opposing team number is null*/}
        </div>
    );
}


export default Field;
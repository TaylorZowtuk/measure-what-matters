import React from 'react';
import { DraggableTypes } from '../constants';
import { useDrop } from 'react-dnd'

import Player, { createPlayerDraggable } from './Player';
import { roster } from './Bench';

type FieldProps = {
    incrementScore:Function,
}

class Field extends React.Component 
    <{
        incrementScore:Function,
    }, 
    {
        on_field: any[],    // Array of draggablePlayer jsx elements
    }> {
    
    constructor(props: FieldProps) {
        super(props);
        this.state = {
            on_field: createPlayerDraggable(this.getPlayers().slice(0, 6))
        }
    }
    
    getPlayers = (): Player[] => {
        return roster;
    }

    addToField = (player:Player) => {
        this.setState(state => {
          const on_field = state.on_field.concat(player);
     
          return {on_field}
        })
    }

    componentDidUpdate(_prevProps: any, _prevState: any) {
        console.log(this.state);
    }

    render () {
        return (
            <FieldTarget draggablePlayers={this.state.on_field} incrementScore={this.props.incrementScore}/>
        )
    }
}

type FieldTargetProps = {
    draggablePlayers:any[],
    incrementScore:Function
};

function FieldTarget(props: FieldTargetProps) {
    const [, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: (item, monitor) => props.incrementScore(true)
        // drop: (item, monitor) => {props.increment_score(     // TODO: increment correct teams score
        //     (monitor.team == "ours") ? true : false 
        // )},
    })

    return (
        <div ref={drop} id="Field">
            {props.draggablePlayers.map((player, index) => (
                <div className="player" key={index}>{player}</div>
          ))}
          {/* Opposing team number is null*/}
          {/* <Player identifier="Bad Guys" number={-1} team="theirs"/>  */}
        </div>
    );
}


export default Field;
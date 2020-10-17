import React from 'react';
import { useDrag } from 'react-dnd'
import { DraggableTypes } from '../constants'
import Button from '@material-ui/core/Button';


type PlayerProps = {
    identifier:string,
    number:number,
    team:string
};

export const Player: React.FC<PlayerProps> = ({identifier, number, team}) => {
    const [, drag] = useDrag({
        item: { type: DraggableTypes.PLAYER, team}
    })

    return(
        <Button ref={drag} variant="contained">{identifier} {(number !== -1) ? (number) : ""}</Button>
    )
}

export default Player;

import React from 'react';
import { useDrag } from 'react-dnd'
import { DraggableTypes } from '../constants'
import Button from '@material-ui/core/Button';

type Player = {
    first_name:string,
    last_name:string,
    num:number, // Jersey number
    team:string,
}

export const PlayerDraggable: React.FC<Player> = ({first_name, last_name, num, team}) => {
    const player:Player = {first_name: first_name, last_name: last_name, num: num, team: team}
    const [, drag] = useDrag({
        item: { type: DraggableTypes.PLAYER, player }
    })

    if (team === "ours") {
        return(
            <Button ref={drag} variant="contained">{num} {first_name} {last_name}</Button>
        )
    }
    else {  // If team is "theirs"
        return(
            <Button ref={drag} variant="contained">Opposing Team</Button>
        )
    }
}

export function createPlayerDraggable(players:Player[]): any[] {
    let playerDraggables:any[] = []
    // For each Player in the players array, create a PlayerDraggable jsx element
    for (var i = 0; i < players.length; i++) {
        playerDraggables.push(<PlayerDraggable 
            first_name={players[i].first_name} 
            last_name={players[i].last_name} 
            num={players[i].num} 
            team="ours"/>
        )
    }
    return playerDraggables;
}  

export default Player;

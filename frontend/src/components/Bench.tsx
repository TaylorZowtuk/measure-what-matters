import React from 'react';
import { DraggableTypes } from '../constants';
import { DropTargetMonitor, useDrop } from 'react-dnd'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';

import Player from './Player';


export const roster:Player[] = 
[
    {
        first_name: 'Charlie',
        last_name: 'Whittle',
        num: 0,
        team: 'ours',
    },
    {
        first_name: 'Mac',
        last_name: 'Ferguson',
        num: 1,
        team: 'ours',
    },
    {
        first_name: 'Dee',
        last_name: 'Barnes',
        num: 2,
        team: 'ours',
    },
    {
        first_name: 'Dennis',
        last_name: 'Yang',
        num: 3,
        team: 'ours',
    },
    {
        first_name: 'Aman',
        last_name: 'Luna',
        num: 4,
        team: 'ours',
    },
    {
        first_name: 'Taylor',
        last_name: 'Wilkins',
        num: 5,
        team: 'ours',
    },
    {
        first_name: 'Kevin',
        last_name: 'Leonard',
        num: 6,
        team: 'ours',
    },
    {
        first_name: 'Laura',
        last_name: 'Watson',
        num: 7,
        team: 'ours',
    },
    {
        first_name: 'Rennay',
        last_name: 'Gordon',
        num: 8,
        team: 'ours',
    },
    {
        first_name: 'Clayton',
        last_name: 'Banks',
        num: 9,
        team: 'ours',
    },
    {
        first_name: 'Zach',
        last_name: 'Ryan',
        num: 10,
        team: 'ours',
    },
    {
        first_name: 'Clarence',
        last_name: 'Briggs',
        num: 11,
        team: 'ours',
    }
]

class Bench extends React.Component 
    <{}, 
    {
        onBench: Player[],
        // The bench is in the expanded state once a player from the field
        // has been dragged into the bench
        isExpanded: boolean,
        // Player object of who to swap in to the bench from the field
        substituteFor: Player | undefined,
    }> {
    
    constructor() {
        super({});
        this.state = {
            onBench: this.getPlayers(),
            isExpanded: false,
            substituteFor: undefined,
        }
    }
    
    getPlayers = (): Player[] => {
        return roster;
    }

    setBench = (players:Player[]): void => {
        this.setState({onBench: players});
    }

    addToBench = (player:Player) => {
        this.setState(state => {
          const onBench = state.onBench.concat(player);
     
          return {onBench: onBench}
        })
    }

    removeFromBench = (removeNum:number) => {
        // Remove the player (first instance) from onBench whose number is num
        var array = [...this.state.onBench];
        var index = array.findIndex(player => player.num === removeNum);
        if (index !== -1) {
            array.splice(index, 1)  // Remove the player
            this.clearSubstituteFor();  // Update onBench
        }
        else {
            console.log("Error: no element in onBench had num of", removeNum);
        }
    }

    toggleIsExpanded = (): void => {
        this.setState({isExpanded: !this.state.isExpanded});
    }

    setSubstituteFor = (player:Player): void => {
        this.setState({substituteFor: player})
    }

    clearSubstituteFor = (): void => {
        this.setState({substituteFor: undefined})
    }

    substitute = (num:number): void => {
        if (this.state.substituteFor === undefined) {
            console.log("Error: substituteFor is undefined");
            return;
        }
        this.removeFromBench(num);  // Remove player from bench
        this.addToBench(this.state.substituteFor);  // Add player from field to bench
        this.clearSubstituteFor();
        this.toggleIsExpanded();    // Close the bench
    }

    componentDidUpdate(_prevProps: any, _prevState: any) {
        console.log(this.state);
    }

    render () {
        if (this.state.isExpanded) {
            return (
                <OpenBench players={this.state.onBench} substitute={this.substitute}/>
            )
        }
        else {
            return (
                <BenchTarget 
                isExpanded={this.state.isExpanded} 
                toggleIsExpanded={this.toggleIsExpanded}
                setSubstituteFor={this.setSubstituteFor}
                />
            )
        }
    }
}

type BenchTargetProps = {
    isExpanded:boolean,
    toggleIsExpanded:Function,
    setSubstituteFor:Function, // Function which takes the num of the Player that was dragged
}

function BenchTarget(props:BenchTargetProps) {
    const [, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: (item: any, _monitor: DropTargetMonitor) => {
            props.toggleIsExpanded();
            props.setSubstituteFor(item.player);
        }
    })
    
    return <div ref={drop} id="bench">Bench Area</div>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  }),
);

type OpenBenchProps = {
    players:Player[],
    substitute:Function,
}

export function OpenBench(props:OpenBenchProps) {
    const classes = useStyles();  
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={10} cellHeight={'auto'}>
          {props.players.map((player:Player) => (
            <GridListTile key={player.num}>
                <Button key={player.num} variant="contained" onClick={() => props.substitute(player.num)}>{player.num} {player.first_name} {player.last_name}</Button>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
}


export default Bench;
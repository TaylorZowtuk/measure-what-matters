import React from 'react';
import { DraggableTypes } from '../constants';
import { DropTargetMonitor, useDrop } from 'react-dnd'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';

type Player = {
    first_name:string,
    last_name:string,
    num:number  // Jersey number
}

type PlayerList = {
    players:Player[]
}

const roster:Player[] = 
[
    {
        first_name: 'Charlie',
        last_name: 'Whittle',
        num: 0
    },
    {
        first_name: 'Mac',
        last_name: 'Ferguson',
        num: 1
    },
    {
        first_name: 'Dee',
        last_name: 'Barnes',
        num: 2
    },
    {
        first_name: 'Dennis',
        last_name: 'Yang',
        num: 3
    },
    {
        first_name: 'Aman',
        last_name: 'Luna',
        num: 4
    },
    {
        first_name: 'Taylor',
        last_name: 'Wilkins',
        num: 5
    },
    {
        first_name: 'Kevin',
        last_name: 'Leonard',
        num: 6
    },
    {
        first_name: 'Laura',
        last_name: 'Watson',
        num: 7
    },
    {
        first_name: 'Rennay',
        last_name: 'Gordon',
        num: 8
    },
    {
        first_name: 'Clayton',
        last_name: 'Banks',
        num: 9
    },
    {
        first_name: 'Zach',
        last_name: 'Ryan',
        num: 10
    },
    {
        first_name: 'Clarence',
        last_name: 'Briggs',
        num: 11
    }
]

class Bench extends React.Component 
    <{}, {
        on_bench: Player[],
        on_field: Player[],
        isExpanded: boolean,
    }> {
    
    constructor() {
        super({});
        this.state = {
            on_bench: this.getPlayers(),
            on_field: [],
            // The bench is in the expanded state once a player from the field
            // has been dragged into the bench
            isExpanded: false
        }
    }
    
    getPlayers = (): Player[] => {
        return roster;
    }

    setBench = (players:Player[]): void => {
        this.setState({on_bench: players});
    }
    
    getBench = (): Player[] => {
        return this.state.on_bench;
    }

    addToBench = (player:Player) => {
        this.setState(state => {
          const on_bench = state.on_bench.concat(player);
     
          return {on_bench}
        })
    }

    addToField = (player:Player) => {
        this.setState(state => {
          const on_field = state.on_field.concat(player);
     
          return {on_field}
        })
    }

    toggleIsExpanded = (): void => {
        this.setState({isExpanded: !this.state.isExpanded});
    }

    componentDidUpdate(_prevProps: any, _prevState: any) {
        console.log(this.state);
    }

    render () {
        if (this.state.isExpanded) {
            return (
                <OpenBench players={this.getBench()}/>
            )
        }
        else {
            return (
                <BenchTarget isExpanded={this.state.isExpanded} toggle={this.toggleIsExpanded}/>
            )
        }
    }
}

type BenchTargetProps = {
    isExpanded:boolean,
    toggle:Function // Function which toggles the isExpanded bool
}

function BenchTarget(props:BenchTargetProps) {
    const [, drop] = useDrop({
        accept: DraggableTypes.PLAYER,
        drop: (item: any, _monitor: DropTargetMonitor) => {
            props.toggle();
        }
    })

    if (props.isExpanded) {
        return <div ref={drop} id="bench">Bench Expanded Area</div>
    }
    else {
        return <div ref={drop} id="bench">Bench Area</div>;
    }
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

export function OpenBench(props:PlayerList) {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={10} cellHeight={'auto'}>
          {props.players.map((tile) => (
            <GridListTile>
                <Button variant="contained">{tile.num} {tile.first_name} {tile.last_name}</Button>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }


export default Bench;
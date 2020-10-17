import React from 'react';
import { DraggableTypes } from '../constants';
import { DropTargetMonitor, useDrop } from 'react-dnd'

type Player = {
    first_name:string,
    last_name:string,
    num:number  // Jersey number
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
            on_bench: [],
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
        this.setState({on_bench: players})
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
        // console.log(this.state);
    }

    render () {

        return (
            <BenchTarget isExpanded={this.state.isExpanded} toggle={this.toggleIsExpanded}/>
        )
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


export default Bench;
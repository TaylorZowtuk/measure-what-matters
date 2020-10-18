/* IGNORE THIS FILE FOR NOW
    NOT USED ANYWHERE */

import React from 'react';
import TextField from '@material-ui/core/TextField';

interface createTeamProps {
    addPlayer: (player: Player) => void;
}

interface createTeamState {
    newPlayerName: string | null;
    newPlayerNumber: number | null;
}

interface Player {
    name: string | null;
    number: number | null;
}

class AddTeamForm extends React.Component<createTeamProps, createTeamState> {
    constructor(props: createTeamProps) {
        super(props);
        this.state = {
            newPlayerName: null,
            newPlayerNumber: null
        }
    }

    handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerName: e.target.value
        })
    }

    handlePlayerNumberChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerNumber: Number(e.target.value)
        })
    }

    onAddPlayer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        e.preventDefault();
        if(this.state.newPlayerName?.trim() != "" && Number(this.state.newPlayerNumber) !== null) {
            this.props.addPlayer({name: this.state.newPlayerName, number: this.state.newPlayerNumber});
        }
    }

    render() {
        return (
            <div className="container">
                <form>
                    <TextField
                        id="outlined-required"
                        label="Player Name"
                        variant="outlined"
                        margin="dense"
                        value={this.state.newPlayerName}
                        onChange={this.handlePlayerNameChange}
                    />
                    <TextField
                    id="outlined-required"
                    label="Player Number"
                    variant="outlined"
                    margin="dense"
                    value={this.state.newPlayerNumber}
                    onChange={this.handlePlayerNumberChange}
                />
                <button onClick={this.onAddPlayer}>add</button>
                </form>
            </div>
        )
    }
}

export default AddTeamForm;
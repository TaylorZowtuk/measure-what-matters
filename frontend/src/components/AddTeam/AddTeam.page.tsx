import React from 'react';
import TextField from '@material-ui/core/TextField';
import './AddTeam.css'
import Button from '@material-ui/core/Button';
import Player from './Player';
import { Link } from "react-router-dom";

interface createTeamState {
    teamName: string;
    playerList: newPlayer[];
    newPlayerName: string;
    newPlayerNumber: string;
    id: number;
}

interface newPlayer {
    name: string;
    number: string;
    id: number;
}

class AddTeam extends React.Component<{}, createTeamState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            teamName: '',
            playerList: [],
            newPlayerName: '',
            newPlayerNumber: '',
            id: 0
        }
    }

    handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            teamName: e.target.value
        })
    }

    handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerName: e.target.value
        })
    }

    handlePlayerNumberChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerNumber: e.target.value
        })
    }

    onAddPlayer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        e.preventDefault();
        if(this.state.newPlayerName?.trim() !== "" && !isNaN(Number(this.state.newPlayerNumber)) && this.state.newPlayerNumber !== "") {
            let incrementId = this.state.id + 1;
            this.setState({
                playerList: [...this.state.playerList, {name: this.state.newPlayerName, number: this.state.newPlayerNumber, id: this.state.id}],
                newPlayerName: '',
                newPlayerNumber: '',
                id: incrementId
            });
        }
    }

    onRemovePlayer = (player: newPlayer) => {
        const index = this.state.playerList.findIndex(oldPlayer => player.id === oldPlayer.id);
        if(index > -1) {
            const oldList = this.state.playerList;
            oldList.splice(index, 1);
            this.setState({
                playerList: oldList
            });
        }
    }

    onAddTeam = () => {
        //TODO: add new team to database
        if(this.state.teamName.trim() !== ''){
            this.setState({
                teamName: '',
                playerList: [],
                newPlayerName: '',
                newPlayerNumber: '',
                id: 0
            });
        }
        else{
            alert("Enter team name");
        }
    }

    render() {
        return (
            <div className="container">
                <TextField
                    required
                    id="outlined-required"
                    label="Team Name"
                    variant="outlined"
                    margin="dense"
                    onChange={this.handleTeamNameChange}
                    value={this.state.teamName}
                />
                <h3>{this.state.teamName}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Player Name</th>
                            <th>Player Number</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>Player 1</td>
                            <td>12</td>
                            <td><button>remove</button></td>
                        </tr> */}
                        {
                            this.state.playerList.map((player) => {
                                return (
                                    <Player player={player} onRemove={this.onRemovePlayer}></Player>
                                );
                            })
                        }
                    </tbody>
                </table>
                <form>

                        <TextField
                            style={{marginRight: 10}}
                            id="outlined-required"
                            label="Player Name"
                            variant="outlined"
                            margin="dense"
                            value={this.state.newPlayerName}
                            onChange={this.handlePlayerNameChange}
                        />


                        <TextField
                        style={{marginRight: 10}}
                        id="outlined-required"
                        label="Player Number"
                        variant="outlined"
                        margin="dense"
                        value={this.state.newPlayerNumber}
                        onChange={this.handlePlayerNumberChange}
                        />

                <button onClick={this.onAddPlayer}>add</button>
                </form>
                    <Button variant="contained" style={{marginBottom: 10}} onClick={this.onAddTeam}>Add Team</Button>
                    <br/>
                    <Link to="/teams">
                        <Button variant="contained">Back</Button>
                    </Link>
            </div>
        )
    }
}

export default AddTeam;
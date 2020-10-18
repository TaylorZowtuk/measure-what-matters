import React from 'react';
import TextField from '@material-ui/core/TextField';
import './AddTeam.css'
import Button from '@material-ui/core/Button';
import Player from './Player';
import { Link } from "react-router-dom";
// import axios from "axios";

interface createTeamState {
    teamName: string;
    playerList: newPlayer[];
    newPlayerFirstName: string;
    newPlayerLastName: string;
    newPlayerNumber: string;
    id: number;
}

interface newPlayer {
    firstName: string;
    lastName: string
    number: string;
    id: number;
}

class AddTeam extends React.Component<{}, createTeamState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            teamName: '',
            playerList: [],
            newPlayerFirstName:'',
            newPlayerLastName: '',
            newPlayerNumber: '',
            id: 0
        }
    }

    /* handle input changes */
    handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            teamName: e.target.value
        })
    }

    handlePlayerFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerFirstName: e.target.value
        })
    }

    handlePlayerLastNameChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerLastName: e.target.value
        })
    }

    handlePlayerNumberChange = (e: React.ChangeEvent<HTMLInputElement>):void =>  {
        this.setState({
            newPlayerNumber: e.target.value
        })
    }
    
    // add player to the team list
    onAddPlayer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        e.preventDefault();
        if(this.state.newPlayerFirstName?.trim() !== "" && this.state.newPlayerLastName?.trim() !== "" && !isNaN(Number(this.state.newPlayerNumber)) && this.state.newPlayerNumber !== "") {
            const index = this.state.playerList.findIndex(oldPlayer => this.state.newPlayerNumber.trim() === oldPlayer.number);
            if (index === -1) {
                let incrementId = this.state.id + 1;
                this.setState({
                    playerList: [...this.state.playerList, {firstName: this.state.newPlayerFirstName, lastName: this.state.newPlayerLastName, number: this.state.newPlayerNumber.trim(), id: this.state.id}],
                    newPlayerFirstName: '',
                    newPlayerLastName: '',
                    newPlayerNumber: '',
                    id: incrementId
                });
            }
        }
    }

    // remove player from the team list
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

    // handles when add team button is pressed
    onAddTeam = () => {
        //TODO: add new team to database
        if(this.state.teamName.trim() !== ''){
            // axios.post('/teams', {name: this.state.teamName, playerList: this.state.playerList})
            // .then(res => {
            //     console.log("add team");
            //     this.setState({
            //         teamName: '',
            //         playerList: [],
            //         newPlayerFirstName: '',
            //         newPlayerLastName: '',
            //         newPlayerNumber: '',
            //         id: 0
            //     });
            // })

            console.log("add team");
            this.setState({
                teamName: '',
                playerList: [],
                newPlayerFirstName: '',
                newPlayerLastName: '',
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
                <h3>Add A New Team</h3>
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
                            label="Player First Name"
                            variant="outlined"
                            margin="dense"
                            value={this.state.newPlayerFirstName}
                            onChange={this.handlePlayerFirstNameChange}
                        />

                        <TextField
                            style={{marginRight: 10}}
                            id="outlined-required"
                            label="Player Last Name"
                            variant="outlined"
                            margin="dense"
                            value={this.state.newPlayerLastName}
                            onChange={this.handlePlayerLastNameChange}
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
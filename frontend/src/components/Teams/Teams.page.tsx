import React from 'react';
import TeamComponent from '../TeamComponent/TeamComponent';
import Button from '@material-ui/core/Button';
import './teams.css'

interface teamProps {
    teamList: Team[]
}

interface teamState {
    teamList: Team[]
}

interface Team {
    playerList: Player[]
}

interface Player{
    name: string;
    number: number;
}

class Teams extends React.Component<{}, teamState>{
    constructor(props: {}){
        super(props);

        this.state = {
            teamList: [
                {
                    playerList: [
                        {
                            name: 'John',
                            number: 1
                        },
                        {
                            name: 'Tom',
                            number: 2
                        },
                        {
                            name: 'Bob',
                            number: 3
                        }
                    ]
                },
                {
                    playerList: [
                        {
                            name: 'Cat',
                            number: 5
                        },
                        {
                            name: 'Lily',
                            number: 6
                        },
                        {
                            name: 'Mag',
                            number: 8
                        }
                    ]
                }
            ]
        }
    };

    addTeam = (): void => {

    }
    
    public render(){
        return (
            <div className="container">
                {this.state.teamList.map((team) => {
                    return (
                        <div className="teamList">
                            <TeamComponent playerList={team.playerList}></TeamComponent>
                            <Button variant="contained">Edit Team</Button>
                        </div>
                    )
                })}
                <Button variant="contained">Add Team</Button>
            </div>
        )
    }
}

export default Teams;
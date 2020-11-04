import React from "react";
import "./Lineup.css";
import axios from "axios";
import authHeader from "../../services/auth.header";

interface Lineup {
  playerList: { name: string }[];
}

interface LineupState {
    lineupList: {
        team: string,
        matchList: {
            date: string,
            goalList: {
                lineup: number[]
            }[]
        }[]
    }[]
}

interface lineup {
    playerList: {name: string}
}



class LineupComponent extends React.Component<any, LineupState> {
    constructor(props: any) {
        super(props);
        this.state = {lineupList: []};

        axios.get('/teams', { headers: authHeader() })
        .then(response => {
            console.log(response.data);
            if(response.data) {
                const tempTeamList : any = [];
                response.data.map((team: any) => {
                    axios.get(`/match/teamId?teamId=${team.teamId}`, { headers: authHeader() })
                    .then(response => {
                        if (response.data) {
                            const tempMatchList: any = [];
                            response.data.map((match: any) => {
                                axios.get(`/event/goals?matchId=${match.matchId}`, { headers: authHeader() })
                                .then(response => {
                                    if (response.data) {
                                        const tempGoalList: any = [];
                                        response.data.map((goal: any) => {
                                            tempGoalList.push({lineup: goal.lineup});
                                        });
                                        tempMatchList.push({date: match.createdDate, goalList: tempGoalList})
                                    }
                                })
                            });
                            tempTeamList.push({team: team.name, matchList: tempMatchList});
                        }
                    })
                });
                this.setState({lineupList: tempTeamList});
            }
        },
        error => {
            console.log("did not get team");
        })
    }
    render() {
        return (
            <div style={{backgroundColor:"whitesmoke", color:"black", borderRadius:"5px", marginBottom:"30px", padding:"15px"}}>
                {/* {
                    this.props.playerList.map((player) => {
                        return(
                            <p className="player">{player.name}</p>
                        );
                    })
                } */}
                <h2 style={{padding:0, margin:0}}>Lineup for Goals</h2>
                {
                    this.state.lineupList.forEach((team) => {
                        return(
                            <div>
                                <h3>{team.team}</h3>
                                <ul>
                                    {team.matchList.map(match => {
                                        match.goalList.map(goal => {
                                        return <li>{match.date} {goal.lineup}</li>
                                        })
                                    })}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default LineupComponent;

import React from "react";
import "./Lineup.css";
import axios from "axios";
import authHeader from "../../services/auth.header";

interface Lineup {
  playerList: { name: string }[];
}

interface LineupState {
    lineupList: teamLineup[],
    finishLoading: boolean
}

interface teamLineup {
    team: string,
    teamId: number,
    matchList: {
        date: string,
        goalList: {
            lineup: number[]
        }[]
    }[]
}

interface lineup {
    playerList: {name: string}
}

const someData: LineupState = {
    lineupList: [
        {
            team: "blue team",
            teamId: 10,
            matchList: [
                {
                    date: "2020-10-31",
                    goalList: [
                        {lineup: [1,2, 3, 4, 5]}
                    ]
                }
            ]
        }
    ],
    finishLoading: true
}

class LineupComponent extends React.Component<any, LineupState> {
    constructor(props: any) {
        super(props);
        this.state = {lineupList: [], finishLoading: false};
    }

    getLineup = async (): Promise<teamLineup[]> => {
        const res = await axios.get('/teams', { headers: authHeader() });
        if (res.data) {
            const tempTeamList: any = [];
            for(let i = 0; i < res.data.length; i++) {
                const matchRes = await axios.get(`/match/teamId?teamId=${res.data[i].teamId}`, { headers: authHeader() });
                if (matchRes.data) {
                    const tempMatchList: any = [];
                    for (let j = 0; j < matchRes.data.length; j++) {
                        const goalRes = await axios.get(`/event/goals?matchId=${matchRes.data[j].matchId}`, { headers: authHeader() });
                        if (goalRes.data) {
                            const tempGoalList: any = [];
                            for (let m = 0; m < goalRes.data.length; m++) {
                                tempGoalList.push({ lineup: goalRes.data[m].lineup });
                            }
                            tempMatchList.push({ date: matchRes.data[j].matchId, goalList: tempGoalList });
                        }
                    }
                    tempTeamList.push({ team: res.data[i].name, teamId: res.data[i].teamId, matchList: tempMatchList });
                }
            }
            return tempTeamList;
        }
        return []; 
    }

    componentDidMount() {
        if (!this.state.finishLoading) {
          this.getLineup().then((lineup: teamLineup[]) => {
            this.setState({ lineupList: lineup, finishLoading: true});
          });
        }
      }

    render() {
        if(!this.state.finishLoading) {
            return (
                <div style={{backgroundColor:"whitesmoke", color:"black", borderRadius:"5px", marginBottom:"30px", padding:"15px"}}>
                    <h2 style={{padding:0, margin:0}}>Lineup for Goals</h2>
                </div>)
        }
        else {
            console.log(this.state);
            return (
            <div style={{backgroundColor:"whitesmoke", color:"black", borderRadius:"5px", marginBottom:"30px", padding:"15px"}}>
                <h2 style={{padding:0, margin:0}}>Lineup for Goals</h2>
                {
                    this.state.lineupList.map((team) => {
                        return(
                            <div key={team.teamId}>
                                <h3>{team.team}</h3>
                                <ul>
                                    {team.matchList.map(match => {
                                        return(
                                            match.goalList.map(goal => {
                                                const lineup = goal.lineup.join(" ");
                                                return <li style={{textAlign:"left", listStyle:"none"}}>match {match.date}: {lineup}</li>
                                            })
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        )
    }}
}

export default LineupComponent;

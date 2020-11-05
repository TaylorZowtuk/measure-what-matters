import React from "react";

interface LineupProps {
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

class LineupRow extends React.Component<LineupProps> {
    constructor(props: LineupProps) {
        super(props);
    };

    render() {
        return (
            <ul>
                {this.props.lineupList.map((team) => {
                    return(
                                team.matchList.map(match => {
                                    let index = 0;
                                    return(
                                    match.goalList.map(goal => {
                                        index += 1;
                                        const lineup = goal.lineup.join(" ");
                                    return (<li key={index} style={{textAlign:"left", listStyle:"none"}}>{match.date} {lineup}</li>)
                                    })
                                    )
                                })
                    )

                })}
            </ul>
        )
    }    
}

export default LineupRow;
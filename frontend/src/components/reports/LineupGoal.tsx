import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";
import { Collapse, List, ListItem, ListItemText } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

interface LineupState {
  lineupList: TeamLineup[];
  finishLoading: boolean;
  open: boolean;
}

interface TeamLineup {
  team: string;
  teamId: number;
  matchList: {
    id: number;
    goalList: {
      lineup: number[];
    }[];
  }[];
}

const someData: LineupState = {
  lineupList: [
    {
      team: "blue team",
      teamId: 10,
      matchList: [
        {
          id: 1,
          goalList: [
            { lineup: [1, 2, 3, 4, 5] },
            { lineup: [10, 20, 30, 40, 50] },
          ],
        },
      ],
    },
  ],
  finishLoading: true,
  open: false,
};

class LineupGoal extends React.Component<any, LineupState> {
  constructor(props: any) {
    super(props);
    this.state = { lineupList: [], finishLoading: false, open: false };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  getLineup = async (): Promise<TeamLineup[]> => {
    const res = await axios.get("/teams", { headers: authHeader() });
    if (res.data) {
      const tempTeamList: any = [];
      for (let i = 0; i < res.data.length; i++) {
        const matchRes = await axios.get(
          `/match/teamId?teamId=${res.data[i].teamId}`,
          { headers: authHeader() }
        );
        if (matchRes.data) {
          const tempMatchList: any = [];
          for (let j = 0; j < matchRes.data.length; j++) {
            const goalRes = await axios.get(
              `/event/goals?matchId=${matchRes.data[j].matchId}`,
              { headers: authHeader() }
            );
            if (goalRes.data) {
              const tempGoalList: any = [];
              for (let m = 0; m < goalRes.data.length; m++) {
                tempGoalList.push({ lineup: goalRes.data[m].lineup });
              }
              tempMatchList.push({
                id: matchRes.data[j].matchId,
                goalList: tempGoalList,
              });
            }
          }
          tempTeamList.push({
            team: res.data[i].name,
            teamId: res.data[i].teamId,
            matchList: tempMatchList,
          });
        }
      }
      return tempTeamList;
    }
    return [];
  };

  componentDidMount() {
    if (!this.state.finishLoading) {
      this.getLineup().then((lineup: TeamLineup[]) => {
        this.setState({ lineupList: lineup, finishLoading: true });
      });
    }
  }

  render() {
    if (!this.state.finishLoading) {
      return (
        <div
          style={{
            backgroundColor: "whitesmoke",
            color: "black",
            borderRadius: "5px",
            marginBottom: "30px",
            padding: "15px",
          }}
        >
          <h2 style={{ padding: 0, margin: 0 }}>Lineup for Goals</h2>
        </div>
      );
    } else {
      return (
        <div
          style={{
            backgroundColor: "whitesmoke",
            color: "black",
            borderRadius: "5px",
            marginBottom: "30px",
            padding: "15px",
          }}
        >
          <h2 style={{ padding: 0, margin: 0 }}>Lineup for Goals</h2>
          {this.state.lineupList.map((team) => {
            return (
              <List component="nav">
                <ListItem button onClick={this.handleClick} key={team.teamId}>
                  <ListItemText primary={team.team} />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {team.matchList.map((match) => {
                      return match.goalList.map((goal) => {
                        const lineup = goal.lineup.join(" ");
                        return (
                          <ListItem button>
                            <ListItemText
                              primary={`match ${match.id}: ${lineup}`}
                            />
                          </ListItem>
                        );
                      });
                    })}
                  </List>
                </Collapse>
              </List>
            );
          })}
        </div>
      );
    }
  }
}

export default LineupGoal;

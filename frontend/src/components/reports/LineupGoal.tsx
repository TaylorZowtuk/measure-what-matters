import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";
import ReportProps from "../interfaces/props/report-props";
import { CircularProgress } from "@material-ui/core";
import { Button } from "react-bootstrap";

interface LineupState {
  lineupList: Lineups[] | null;
  finishLoading: boolean;
  open: boolean;
  reload: number;
}

interface Lineups {
  index: number;
  lineup: string[];
  ours: boolean;
  time: number;
}

class LineupGoal extends React.Component<ReportProps, LineupState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = {
      lineupList: null,
      finishLoading: false,
      open: false,
      reload: 0,
    };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  getLineup = async (): Promise<Lineups[] | null> => {
    if (this.props.matchId) {
      try {
        const res = await axios.get(
          `/player-stats/onForGoal?matchId=${this.props.matchId}`,
          { headers: authHeader() }
        );
        if (res.data) {
          console.log(this.props.matchId);
          console.log(res);
          const tempLineupList: any = [];
          // sort by time
          res.data.sort((a: any, b: any) => {
            return a.goal.time > b.goal.time ? 1 : -1;
          });
          for (let i = 1; i < res.data.length + 1; i++) {
            const players: any = [];
            for (let j = 0; j < res.data[i - 1].players.length; j++) {
              players.push(
                res.data[i - 1].players[j].firstName +
                  " " +
                  res.data[i - 1].players[j].lastName
              );
            }
            if (!res.data[i - 1].goal.playerId) {
              // opponent scored
              tempLineupList.push({
                index: i,
                lineup: players,
                ours: false,
                time: res.data[i - 1].goal.time,
              });
            } else {
              tempLineupList.push({
                index: i,
                lineup: players,
                ours: true,
                time: res.data[i - 1].goal.time,
              });
            }
          }
          return tempLineupList;
        }
        return null;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  validateLineup = () => {
    // lineupList is null
    if (!this.state.lineupList) return false;
    for (let i = 0; i < this.state.lineupList.length; i++) {
      // no lineup during goal
      if (this.state.lineupList[i].lineup.length === 0) return false;
    }
    return true;
  };

  reloadOnClick = () => {
    this.setState({ reload: this.state.reload + 1 });
  };

  updateAndNotify = () => {
    this.getLineup().then((lineup: Lineups[] | null) => {
      this.setState({ lineupList: lineup, finishLoading: true });
    });
  };

  //update when match changed
  componentDidUpdate(prevProps: ReportProps) {
    if (prevProps.matchId !== this.props.matchId) {
      this.updateAndNotify();
    }
  }

  componentDidMount() {
    if (!this.state.finishLoading) {
      this.getLineup().then((lineup: Lineups[] | null) => {
        this.setState({ lineupList: lineup, finishLoading: true });
      });
    }
  }

  render() {
    if (!this.props.matchId) {
      return null;
    }
    // If we havent completed the asynchronous data fetch yet; return a loading indicator
    if (!this.state.finishLoading) return <CircularProgress />;
    if (!this.validateLineup())
      return (
        <Button variant="warning" onClick={this.reloadOnClick}>
          {" "}
          Something Went Wrong... Click To Reload Report
        </Button>
      );
    // If there is no goals for the match
    if (this.state.lineupList) {
      if (this.state.lineupList.length <= 0) {
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
            <p>No goals</p>
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
            <div style={{ display: "flex" }}>
              <p
                style={{
                  backgroundColor: "#ffb3b3",
                  width: "40px",
                  height: "10px",
                  margin: "auto 10px",
                  opacity: 0.8,
                }}
              >
                &nbsp;
              </p>
              <p style={{ fontSize: "16px", margin: "auto 10px" }}>
                opponents goal
              </p>
            </div>
            <table
              style={{
                margin: "10px auto",
                color: "#282c34",
                fontSize: "14pt",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "10px" }}>Goal</th>
                  <th style={{ padding: "10px" }}>Line During Goal</th>
                </tr>
              </thead>
              <tbody>
                {this.state.lineupList.map((lineup: Lineups) => {
                  const lineupString = lineup.lineup.join(", ");
                  return lineup.ours ? (
                    <tr key={lineup.index}>
                      <td>{lineup.index}</td>
                      <td>{lineupString}</td>
                    </tr>
                  ) : (
                    <tr
                      key={lineup.index}
                      style={{ backgroundColor: "#ffb3b3" }}
                    >
                      <td>{lineup.index}</td>
                      <td>{lineupString}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }
  }
}

export default LineupGoal;

import React from "react";
import axios from "axios";
import authHeader from "../../services/auth.header";
import ReportProps from "../interfaces/props/report-props";

interface LineupState {
  lineupList: Lineups[];
  finishLoading: boolean;
  open: boolean;
}

interface Lineups {
  index: number;
  lineup: number[];
}

class LineupGoal extends React.Component<ReportProps, LineupState> {
  constructor(props: ReportProps) {
    super(props);
    this.state = { lineupList: [], finishLoading: false, open: false };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  getLineup = async (): Promise<Lineups[]> => {
    if (this.props.matchId) {
      const res = await axios.get(
        `/event/goals?matchId=${this.props.matchId}`,
        { headers: authHeader() }
      );
      if (res.data) {
        const tempLineupList: any = [];
        for (let i = 1; i < res.data.length + 1; i++) {
          tempLineupList.push({ index: i, lineup: res.data[i - 1].lineup });
        }
        return tempLineupList;
      }
      return [];
    }
    return [];
  };

  componentDidMount() {
    if (!this.state.finishLoading) {
      this.getLineup().then((lineup: Lineups[]) => {
        this.setState({ lineupList: lineup, finishLoading: true });
      });
    }
  }

  render() {
    if (!this.state.finishLoading || this.state.lineupList.length <= 0) {
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
                <th style={{ padding: "10px" }}>Lineup</th>
              </tr>
            </thead>
            <tbody>
              {this.state.lineupList.map((lineup: Lineups) => {
                const lineupString = lineup.lineup.join(" ");
                return (
                  <tr key={lineup.index}>
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

export default LineupGoal;

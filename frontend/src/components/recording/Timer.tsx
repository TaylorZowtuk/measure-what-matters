import React from "react";
import Button from "react-bootstrap/esm/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../../services/auth.header";
import { fullTimeDTO } from "../interfaces/fullTime";
import { halftimeDTO } from "../interfaces/halftime";

type TimerProps = { resetPossession: Function; resetShootingState: Function };

class Timer extends React.Component<
  TimerProps,
  { timerOn: boolean; timerStart: number; timerTime: number; halfTime: number }
> {
  timer: number;
  constructor(props: TimerProps) {
    super(props);
    this.state = {
      timerOn: false,
      timerStart: 0, // Unix Epoch (ms after 1970)
      timerTime: 0, // Total time (ms) that timer has been running
      halfTime: 0, // The value of timerTime when halftime was called
    };
    this.timer = 0;
  }

  startTimer = () => {
    // Perform initial update and turn timing state on
    this.setState({
      timerOn: true,
      timerStart: Date.now() - this.state.timerTime,
    });
    window._recordingState.setTimerIsOn(true);
    // Set up an interval which calls the setState callback every 10ms
    this.timer = window.setInterval(() => {
      const accumulated: number = Date.now() - this.state.timerStart;
      this.setState({
        timerTime: accumulated,
      });
      window._recordingState.setCurrentTotalPlayTime(
        accumulated + this.state.halfTime
      );
    }, 10);
  };

  resetTimer = () => {
    this.setState({
      timerStart: 0,
      timerTime: 0,
    });
  };

  stopTimer = () => {
    this.setState({ timerOn: false }); // Set timer to off state
    clearInterval(this.timer); // Clear the interval
    window._recordingState.setTimerIsOn(false);
    this.setPausedInterface();
  };

  endHalf = () => {
    // Save the total time when halftime occurred
    this.setState({ halfTime: this.state.timerTime });

    // Reset the timer
    this.resetTimer();

    this.setPausedInterface();

    // Post to the match halftime endpoint
    let halftime: halftimeDTO = {
      matchId: window._recordingState.getMatchId(),
      time: window._recordingState.getCurrentTotalPlayTime(),
    };

    axios
      .post(`/api/match/halftime`, halftime, { headers: authHeader() })
      .then((res) => {
        console.log("Post halftime response:", res); // TODO: catch error and handle if needed
      });
  };

  endGame = (): void => {
    this.stopTimer();

    // Post to the match end game endpoint
    let endTime: fullTimeDTO = {
      matchId: window._recordingState.getMatchId(),
      time: window._recordingState.getCurrentTotalPlayTime(),
    };

    axios
      .post(`/api/match/fullTime`, endTime, { headers: authHeader() })
      .then((res) => {
        console.log("Post full time response:", res); // TODO: catch error and handle if needed
      });
  };

  // Resets all interface that depends on the timer being running
  setPausedInterface = (): void => {
    // Reset ball possession to neutral
    this.props.resetPossession();
    // Exit shooting state if we were selecting a shot result
    this.props.resetShootingState();
  };

  componentWillUnmount() {
    // Dont let interval hang around when component is unmounted
    clearInterval(this.timer);
  }

  render() {
    const { timerTime } = this.state;
    // Format the time
    // Concatenate 0 to front and slice off all but the two lowest digits
    let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
    let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
    let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

    return (
      <div className="Timer">
        <div className="Period-display">
          {this.state.halfTime === 0 ? "1st" : "2nd"} Half
        </div>

        <div className="Timer-display">
          {hours} : {minutes} : {seconds} : {centiseconds}
        </div>

        {/* If we havent started timer yet */}
        {this.state.timerOn === false && this.state.timerTime === 0 && (
          <Button variant="success" onClick={this.startTimer}>
            Start
          </Button>
        )}

        {/* If timer is running */}
        {this.state.timerOn === true && (
          <Button variant="danger" onClick={this.stopTimer}>
            Pause
          </Button>
        )}

        {/* If timer isnt running right now and timer has been started previously */}
        {this.state.timerOn === false && this.state.timerTime > 0 && (
          <Button variant="success" onClick={this.startTimer}>
            Resume
          </Button>
        )}

        {/* If timer isnt running right now and timer has been started previously
            and we're in the first half */}
        {this.state.timerOn === false &&
          this.state.timerTime > 0 &&
          this.state.halfTime === 0 && (
            <Button
              variant="warning"
              onClick={this.endHalf}
              style={{ marginLeft: "25px" }}
            >
              End Half
            </Button>
          )}

        {/* If timer isnt running right now and timer has been started previously
            and we're in the second half */}
        {this.state.timerOn === false &&
          this.state.timerTime > 0 &&
          this.state.halfTime !== 0 && (
            <Link to="/dashboard">
              <Button
                variant="danger"
                onClick={this.endGame}
                style={{ marginLeft: "25px" }}
              >
                End Game
              </Button>
            </Link>
          )}
      </div>
    );
  }
}

export default Timer;

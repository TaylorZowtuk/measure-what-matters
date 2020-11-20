export class RecordingState {
  // Constants
  private matchId: number;
  // Changing
  private timerIsOn: boolean; // Wether or not the game clock is running right now
  private currentTotalPlayTime: number; // Total play time (ms) that has occurred

  constructor(matchId: number) {
    this.matchId = matchId;
    this.timerIsOn = false;
    this.currentTotalPlayTime = 0;
  }
  getMatchId(): number {
    return this.matchId;
  }
  setTimerIsOn(isOn: boolean) {
    this.timerIsOn = isOn;
    // console.log(this.timerIsOn);
  }
  getTimerIsOn(): boolean {
    console.log(this.timerIsOn);
    return this.timerIsOn;
  }
  setCurrentTotalPlayTime(currentTotalPlayTime: number) {
    this.currentTotalPlayTime = currentTotalPlayTime;
    // console.log(this.currentTotalPlayTime);
  }
  getCurrentTotalPlayTime(): number {
    console.log(this.currentTotalPlayTime);
    return this.currentTotalPlayTime;
  }
}

// Extend the window interface to include the global recording state
declare global {
  interface Window {
    _recordingState: RecordingState;
  }
}

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import {
  GoalOnClickProps,
  ShotFieldInfo,
  ShotResultPicker,
} from "../components/recording/ShotResultPicker";
import Player from "../components/interfaces/player";
import CircularBuffer from "../util/circular-buffer";

afterEach(cleanup);

// Testing object
let shooter: Player = {
  firstName: "Bob",
  lastName: "William",
  jerseyNum: 7,
  teamId: 1,
  playerId: 1,
};
let shotFieldInfo: ShotFieldInfo = {
  shooter: shooter,
  previousPossessions: new CircularBuffer(2),
  getLineup: () => {},
};
let goalOnClickProps: GoalOnClickProps = {
  fieldInfo: shotFieldInfo,
  matchId: 1,
  incrementScore: () => {},
  exitShootingState: () => {},
};

test("renders the shot result selector", () => {
  const { getByText } = render(
    <ShotResultPicker shooting={true} propsIfGoal={goalOnClickProps} />
  );

  const headerElement = getByText(/selection/i);
  expect(headerElement).toBeInTheDocument();
});

test("doesnt render the shot result selector when not in shooting state", () => {
  render(<ShotResultPicker shooting={false} propsIfGoal={goalOnClickProps} />);

  const headerElement = screen.queryByText(/selection/i);
  expect(headerElement).not.toBeInTheDocument();
});

test("renders the shot result buttons", () => {
  const { getByText } = render(
    <ShotResultPicker shooting={true} propsIfGoal={goalOnClickProps} />
  );

  const missButton = getByText(/miss/i);
  expect(missButton).toBeInTheDocument();
  const saveButton = getByText(/save/i);
  expect(saveButton).toBeInTheDocument();
  const goalButton = getByText(/goal/i);
  expect(goalButton).toBeInTheDocument();
});

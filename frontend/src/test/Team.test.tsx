import React from "react";
import { cleanup, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Team from "../components/recording/Team";

afterEach(cleanup);

test("renders props provided to team component correctly", () => {
  const { getByText } = render(
    <BrowserRouter>
      <Team name={"Good Guys"} score={10} />
    </BrowserRouter>
  );

  // Team name should be displayed
  const teamName = getByText(/Good Guys/i);
  expect(teamName).toBeInTheDocument();

  // The teams score should be displayed
  const score = getByText(/10/i);
  expect(score).toBeInTheDocument();
});

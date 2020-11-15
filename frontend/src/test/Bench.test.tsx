import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Bench from "../components/recording/Bench";

afterEach(cleanup);

test("renders the bench area when not expanded", () => {
  const { getByText } = render(
    <DndProvider backend={HTML5Backend}>
      <Bench
        getStartingBench={() => {}}
        notifyOfSubs={() => {}}
        inShootingState={false}
      />
    </DndProvider>
  );

  const headerElement = getByText(/Bench/i);
  expect(headerElement).toBeInTheDocument();
  const subHeaderElement = getByText(/to substitute/i);
  expect(subHeaderElement).toBeInTheDocument();
});

test("does not render the bench area when in shooting state", () => {
  render(
    <DndProvider backend={HTML5Backend}>
      <Bench
        getStartingBench={() => {}}
        notifyOfSubs={() => {}}
        inShootingState={true}
      />
    </DndProvider>
  );

  const headerElement = screen.queryByText(/Bench/i);
  expect(headerElement).not.toBeInTheDocument();
  const subHeaderElement = screen.queryByText(/to substitute/i);
  expect(subHeaderElement).not.toBeInTheDocument();
});

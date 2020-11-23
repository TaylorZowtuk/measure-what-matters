import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TouchesTable, {
  fetchTouchesRows,
  hardCodedRows,
} from "../components/reports/Touches";

afterEach(cleanup);

test("renders touches report", () => {
  const { getByText } = render(<TouchesTable fetchTouches={() => {}} />);

  const headerElement = getByText(/Touches/i);
  expect(headerElement).toBeInTheDocument();
});

test("doesent render touches report if we dont recieve data", () => {
  render(<TouchesTable fetchTouches={() => {}} />);

  const headerElement = screen.queryByText(/Touches/i);
  expect(headerElement).not.toBeInTheDocument();
});

test("renders touches report legend", () => {
  const { getByText } = render(<TouchesTable fetchTouches={() => {}} />);

  const legendFirst = getByText(/first/i);
  expect(legendFirst).toBeInTheDocument();
  const legendSecond = getByText(/second/i);
  expect(legendSecond).toBeInTheDocument();
});

test("renders data in touches report", () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByText } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
  );

  expect(mockFetch).toHaveBeenCalled();

  // Renders player with lowest touches
  const jimName = getByText(/sly/i);
  expect(jimName).toBeInTheDocument();

  // Renders last player
  const jackName = getByText(/herman/i);
  expect(jackName).toBeInTheDocument();
});

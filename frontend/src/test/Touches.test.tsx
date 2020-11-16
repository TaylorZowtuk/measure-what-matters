import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TouchesBar, {
  fetchTouches,
  firstData,
  secondData,
} from "../components/reports/Touches";

afterEach(cleanup);

test("renders touches report", () => {
  const { getByText } = render(<TouchesBar fetchTouches={() => {}} />);

  const headerElement = getByText(/Touches/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders touches report legend", () => {
  const { getByText } = render(<TouchesBar fetchTouches={() => {}} />);

  const legendFirst = getByText(/first/i);
  expect(legendFirst).toBeInTheDocument();
  const legendSecond = getByText(/second/i);
  expect(legendSecond).toBeInTheDocument();
});

test("renders data in touches report", () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouches>;
  mockFetch.mockReturnValue([firstData, secondData]);

  const { getByText } = render(<TouchesBar fetchTouches={mockFetch} />);

  expect(mockFetch).toHaveBeenCalled();

  // Renders first player
  const jimName = getByText(/jim/i);
  expect(jimName).toBeInTheDocument();

  // Renders last player
  const jackName = getByText(/jack/i);
  expect(jackName).toBeInTheDocument();
});

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PossessionCircular, {
  CircularProgressWithLabel,
  fetchTimes,
} from "../components/reports/Possession";

afterEach(cleanup);

test("renders possession time reports", () => {
  const { getByText } = render(<PossessionCircular fetchTimes={() => {}} />);

  const headerElement = getByText(/Possession/i);
  expect(headerElement).toBeInTheDocument();
  const firstHalf = getByText(/first/i);
  expect(firstHalf).toBeInTheDocument();
  const secondHalf = getByText(/second/i);
  expect(secondHalf).toBeInTheDocument();
  const thirdHalf = getByText(/overall/i);
  expect(thirdHalf).toBeInTheDocument();
});

test("renders the percentage of possession times", () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTimes>;
  mockFetch.mockReturnValue([0, 31, 100]);

  const { getByText } = render(<PossessionCircular fetchTimes={mockFetch} />);
  expect(mockFetch).toHaveBeenCalled();

  const firstPossession = getByText("0%");
  expect(firstPossession).toBeInTheDocument();
  const secondPossession = getByText("31%");
  expect(secondPossession).toBeInTheDocument();
  const overallPossession = getByText("100%");
  expect(overallPossession).toBeInTheDocument();
});

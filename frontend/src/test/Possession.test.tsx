import React from "react";
import { cleanup, render, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PossessionCircular, {
  fetchTimes,
} from "../components/reports/Possession";
import { CircularProgress } from "@material-ui/core";

afterEach(cleanup);

test("renders possession time reports", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTimes>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve([0, 31, 100]);
    })
  );

  const { getByText } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );
  // While the fetch hasnt completed shows loading
  await waitForElement(() => <CircularProgress />);
  expect(mockFetch).toHaveBeenCalled();

  const headerElement = getByText(/Possession/i);
  expect(headerElement).toBeInTheDocument();
  const firstHalf = getByText(/first/i);
  expect(firstHalf).toBeInTheDocument();
  const secondHalf = getByText(/second/i);
  expect(secondHalf).toBeInTheDocument();
  const thirdHalf = getByText(/overall/i);
  expect(thirdHalf).toBeInTheDocument();
});

test("renders the percentage of possession times", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTimes>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve([0, 31, 100]);
    })
  );

  const { getByText } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );
  // While the fetch hasnt completed shows loading
  await waitForElement(() => <CircularProgress />);
  expect(mockFetch).toHaveBeenCalled();

  const firstPossession = getByText("0%");
  expect(firstPossession).toBeInTheDocument();
  const secondPossession = getByText("31%");
  expect(secondPossession).toBeInTheDocument();
  const overallPossession = getByText("100%");
  expect(overallPossession).toBeInTheDocument();
});

test("renders loading indicator while data fetch hasnt completed", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTimes>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve([0, 31, 100]);
    })
  );

  const { getByText } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );
  // While the fetch hasnt completed shows loading
  await waitForElement(() => <CircularProgress />);
  expect(mockFetch).toHaveBeenCalled();

  const headerElement = getByText(/Possession/i);
  expect(headerElement).toBeInTheDocument();
  const firstHalf = getByText(/first/i);
  expect(firstHalf).toBeInTheDocument();
  const secondHalf = getByText(/second/i);
  expect(secondHalf).toBeInTheDocument();
  const thirdHalf = getByText(/overall/i);
  expect(thirdHalf).toBeInTheDocument();
});

import React from "react";
import {
  cleanup,
  render,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PossessionCircular, {
  fetchTimes,
} from "../components/reports/Possession";

afterEach(cleanup);

test("renders possession time reports", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTimes>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve([0, 31, 100]);
    })
  );

  const { getByTestId, getByText } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
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

  const { getByTestId, getByText } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
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
    new Promise(async (resolve, reject) => {
      await new Promise((r) => setTimeout(r, 500)); // Delay the promise being resolved
      resolve([0, 31, 100]);
    })
  );

  const { getByTestId } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );

  // While the fetch hasnt completed shows loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();
});

test("renders the attempt reload button on empty return", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTimes>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve([]); // Empty data returned
    })
  );

  const { getByTestId, getByText } = render(
    <PossessionCircular matchId={1} fetchTimes={mockFetch} />
  );
  // Loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();
});

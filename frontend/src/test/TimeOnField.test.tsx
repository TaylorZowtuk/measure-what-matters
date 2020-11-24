import React from "react";
import {
  cleanup,
  screen,
  fireEvent,
  render,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import TimeOnField, {
  createData,
  fetchTimeOnFieldRows,
} from "../components/reports/TimeOnField";

afterEach(cleanup);

const hardCodedRows = [
  // page #
  createData("Rob", "Park", 7, 12512), // 2
  createData("Jim", "Floyd", 12, 167812), // 1
  createData("Sly", "Jackson", 6, 125612), // 1
  createData("Rod", "Nedson", 16, 56312), // 2
  createData("Fin", "Clarkson", 13, 34126), // 2
  createData("Tanner", "Greggel", 11, 2556),
  createData("Shirl", "Benter", 24, 0),
  createData("Becky", "Clarke", 31, 5647), // 2
  createData("Steph", "Sampson", 26, 586),
  createData("Aaminah", "Hood", 1, 12345678), // 1
  createData("Jenn", "Winston", 23, 86168), // 2
  createData("Bruce", "Banner", 28, 1646),
  createData("Greyson", "Grey", 18, 125456), // 1
  createData("Herman", "Blake", 19, 2547356), // 1
];

test("renders time on field report", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByTestId, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  const headerElement = getByText(/Time on Field/i);
  expect(headerElement).toBeInTheDocument();
  const name = getByText(/player name/i);
  expect(name).toBeInTheDocument();
  const num = getByText(/player number/i);
  expect(num).toBeInTheDocument();
  const minutes = getByText(/minutes played/i);
  expect(minutes).toBeInTheDocument();
});

test("renders the players time on field data in the report", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByTestId, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // Player rows should be displayed; displays in desc order of minutes by default
  const player = getByText(/aaminah hood/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("1");
  expect(playerNum).toBeInTheDocument();
  const mins = getByText("205.8");
  expect(mins).toBeInTheDocument();
});

test("navigates to second page and renders new data", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByTestId, getByTitle, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // Next page button should be visible and clickable
  const np = getByTitle(/next page/i);
  expect(np).toBeInTheDocument();
  fireEvent.click(np);
  // Players on the second page should be displayed
  const player = getByText(/fin clarkson/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("13");
  expect(playerNum).toBeInTheDocument();
  const mins = getByText("0.6");
  expect(mins).toBeInTheDocument();
});

test("renders loading indicator while data fetch hasnt completed", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch.mockReturnValue(
    new Promise(async (resolve, reject) => {
      await new Promise((r) => setTimeout(r, 500)); // Delay the promise being resolved
      resolve(hardCodedRows);
    })
  );

  const { getByTestId } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );

  // While the fetch hasnt completed shows loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();
});

test("renders the attempt reload button on empty fetch", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([]); // Empty data returned; 1st render
      })
    )
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve(hardCodedRows); // Proper data returned; 2nd render
      })
    );

  const { getByTestId, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // When the return is invalid we display a button to reload the report
  const reloadButton = getByText(/load/i);
  expect(reloadButton).toBeInTheDocument();

  // When we click the reload button
  fireEvent.click(reloadButton);
  // And we get new, proper data
  expect(mockFetch.mock.calls.length).toBe(2); // Called the second time
  await waitForElementToBeRemoved(() => getByText(/load/i));
  await waitForElement(() => getByText(/aaminah hood/i));

  // The proper data should be displayed
  const player = getByText(/aaminah hood/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("1");
  expect(playerNum).toBeInTheDocument();
  const mins = getByText("205.8");
  expect(mins).toBeInTheDocument();
});

test("removes only invalid items from the returned data if possible", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([createData("Rob", "Park", 7, 1251111111111112)]); // One invalid item
      })
    )
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([
          createData("Rob", "Park", 7, 1251111111111112),
          createData("Aaminah", "Hood", 1, 12345678),
        ]); // One valid and one invalid item
      })
    );

  const { getByTestId, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // When the return is invalid we display a button to reload the report
  const reloadButton = getByText(/load/i);
  expect(reloadButton).toBeInTheDocument();

  // When we click the reload button
  fireEvent.click(reloadButton);
  // And we get more data which contains improper and proper data
  // Only the proper data is rendered
  expect(mockFetch.mock.calls.length).toBe(2); // Called the second time
  // The proper data should be displayed
  await waitForElement(() => getByText(/aaminah hood/i));
  const player = getByText(/aaminah hood/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("1");
  expect(playerNum).toBeInTheDocument();
  const mins = getByText("205.8");
  expect(mins).toBeInTheDocument();
  // And not the improper data
  const rob = screen.queryByText(/rob/i);
  expect(rob).not.toBeInTheDocument();
});

test("renders the attempt reload button on invalid length data fetched", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([createData("Rob", "Park", 7, 1251111111111112)]); // One invalid item
      })
    )
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([createData("Robbie", "Parka", 77, 151361265613662)]); // Different invalid data
      })
    );

  const { getByTestId, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // When the return is invalid we display a button to reload the report
  const reloadButton = getByText(/load/i);
  expect(reloadButton).toBeInTheDocument();

  // When we click the reload button
  fireEvent.click(reloadButton);
  // And we get more improper data
  expect(mockFetch.mock.calls.length).toBe(2); // Called the second time
  // We immediately get the same reload option
  await waitForElement(() => getByText(/load/i));
});

test("renders the attempt reload button on invalid values fetched", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<
    typeof fetchTimeOnFieldRows
  >;
  mockFetch.mockReturnValueOnce(
    new Promise((resolve, reject) => {
      resolve([
        createData("", "", 7, 1251), // Empty name
        createData("Jan", "Park", 0, 1251), // Jersey num 0
        createData("Jan", "Park", -1, 1251), // Jersey num negative
        createData("Jan", "Park", 101, 1251), // Jersey num too large
        createData("Jan", "Park", 101, -1), // Minutes negative
        createData("Jan", "Park", 101, 12511124512515215), // Minutes too large
      ]);
    })
  );

  const { getByTestId, getByText } = render(
    <TimeOnField matchId={1} fetchTimeOnField={mockFetch} />
  );
  // Loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // When the return is invalid we display a button to reload the report
  // No data should be rendered
  const reloadButton = getByText(/load/i);
  expect(reloadButton).toBeInTheDocument();
});

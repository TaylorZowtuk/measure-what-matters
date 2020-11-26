import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TouchesTable, {
  createData,
  fetchTouchesRows,
} from "../components/reports/Touches";

afterEach(cleanup);

const hardCodedRows = [
  createData("Rob", "Park", 7, 12, 12, 24), // 1
  createData("Jake", "Floyd", 1, 1, 0, 1),
  createData("Jim", "Floyd", 12, 17, 10, 27), // 1
  createData("Sly", "Jackson", 6, 0, 0, 0),
  createData("Rod", "Nedson", 16, 1, 1, 2),
  createData("Fin", "Clarkson", 13, 3, 3, 6),
  createData("Tanner", "Greggel", 11, 2, 30, 32), // 1
  createData("Shirl", "Benter", 24, 11, 24, 35), // 1
  createData("Becky", "Clarke", 31, 5, 4, 9), // 2
  createData("Steph", "Sampson", 26, 5, 8, 13), // 2
  createData("Jenn", "Winston", 23, 18, 4, 22), // 1
  createData("Bruce", "Banner", 28, 16, 3, 19), // 2
  createData("Greyson", "Grey", 18, 12, 5, 17), // 2
  createData("Herman", "Blake", 77, 12, 5, 17), // 2
];

test("renders touches report", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByTestId, getByText } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  const headerElement = getByText(/Number of Touches/i);
  expect(headerElement).toBeInTheDocument();
  const name = getByText(/Player Name/i);
  expect(name).toBeInTheDocument();
  const num = getByText(/Player Number/i);
  expect(num).toBeInTheDocument();
  const firstHalf = getByText(/first/i);
  expect(firstHalf).toBeInTheDocument();
  const secondHalf = getByText(/second/i);
  expect(secondHalf).toBeInTheDocument();
  const overall = getByText(/overall/i);
  expect(overall).toBeInTheDocument();
});

test("renders the players data in the report", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByTestId, getByText } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // Player rows should be displayed; displays in desc order of overall by default
  const player = getByText(/Jenn Winston/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("23");
  expect(playerNum).toBeInTheDocument();
  const first = getByText("18");
  expect(first).toBeInTheDocument();
  const second = getByText("4");
  expect(second).toBeInTheDocument();
  const overall = getByText("22");
  expect(overall).toBeInTheDocument();
});

test("navigates to second page and renders new data", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch.mockReturnValue(
    new Promise((resolve, reject) => {
      resolve(hardCodedRows);
    })
  );

  const { getByTitle, getByTestId, getByText } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
  );
  // Loading
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();

  // Next page button should be visible and clickable
  const np = getByTitle(/next page/i);
  expect(np).toBeInTheDocument();
  fireEvent.click(np);
  // Players on the second page should be displayed
  const player = getByText(/Bruce Banner/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("28");
  expect(playerNum).toBeInTheDocument();
  const first = getByText("16");
  expect(first).toBeInTheDocument();
  const second = getByText("3");
  expect(second).toBeInTheDocument();
  const overall = getByText("19");
  expect(overall).toBeInTheDocument();
});

test("renders loading indicator while data fetch hasnt completed", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch.mockReturnValue(
    new Promise(async (resolve, reject) => {
      await new Promise((r) => setTimeout(r, 500)); // Delay the promise being resolved
      resolve(hardCodedRows);
    })
  );

  const { getByTestId } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
  );

  // While the fetch hasnt completed shows loading
  const loadingIndicator = getByTestId("loading_indicator");
  expect(loadingIndicator).toBeInTheDocument();
  await waitForElementToBeRemoved(() => getByTestId("loading_indicator"));
  expect(mockFetch).toHaveBeenCalled();
});

test("renders the attempt reload button on empty fetch", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
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

  const { getByText, getByTestId } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
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
  await waitForElement(() => getByText(/Jenn Winston/i));

  // The proper data should be displayed
  const player = getByText(/Jenn Winston/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("23");
  expect(playerNum).toBeInTheDocument();
  const first = getByText("18");
  expect(first).toBeInTheDocument();
  const second = getByText("4");
  expect(second).toBeInTheDocument();
  const overall = getByText("22");
  expect(overall).toBeInTheDocument();
});

test("removes only invalid items from the returned data if possible", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([createData("Dirk", "Huddsoon", -1, 3, 3, 6)]); // One invalid item
      })
    )
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([
          createData("Dirk", "Huddsoon", -1, 3, 3, 6),
          createData("Jenn", "Winston", 23, 18, 4, 22),
        ]); // One valid and one invalid item
      })
    );

  const { getByText, getByTestId } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
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
  await waitForElement(() => getByText(/Jenn Winston/i));
  const player = getByText(/Jenn Winston/i);
  expect(player).toBeInTheDocument();
  const playerNum = getByText("23");
  expect(playerNum).toBeInTheDocument();
  const first = getByText("18");
  expect(first).toBeInTheDocument();
  const second = getByText("4");
  expect(second).toBeInTheDocument();
  const overall = getByText("22");
  expect(overall).toBeInTheDocument();
  // And not the improper data
  const dirk = screen.queryByText(/dirk/i);
  expect(dirk).not.toBeInTheDocument();
});

test("renders the attempt reload button on invalid length data fetched", async () => {
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([createData("Dirk", "Huddsoon", -1, 3, 3, 6)]); // One invalid item
      })
    )
    .mockReturnValueOnce(
      new Promise((resolve, reject) => {
        resolve([createData("Dirk", "Huddsoon", -1, 3, 3, 6)]); // Different invalid data
      })
    );

  const { getByText, getByTestId } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
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
  const mockFetch = jest.fn() as jest.MockedFunction<typeof fetchTouchesRows>;
  mockFetch.mockReturnValueOnce(
    new Promise((resolve, reject) => {
      resolve([
        createData("", "", 1, 3, 3, 6), // Empty name
        createData("Dirk", "Huddsoon", 0, 3, 3, 6), // Jersey num 0
        createData("Dirk", "Huddsoon", -100, 3, 3, 6), // Jersey num negative
        createData("Dirk", "Huddsoon", 101, 3, 3, 6), // Jersey num too large
        createData("Dirk", "Huddsoon", 1, -1, 3, 6), // First # touches negative
        createData("Dirk", "Huddsoon", 1, 1001, 3, 6), // First # touches too large
        createData("Dirk", "Huddsoon", 1, 0, -10, 6), // Second # touches negative
        createData("Dirk", "Huddsoon", 1, 0, 10001, 6), // Second # touches too large
        createData("Dirk", "Huddsoon", 1, 0, 3, -1111), // Overall # touches negative
        createData("Dirk", "Huddsoon", 1, 3, 3, 99999999), // Overall # touches too large
      ]);
    })
  );

  const { getByText, getByTestId } = render(
    <TouchesTable matchId={1} fetchTouches={mockFetch} />
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

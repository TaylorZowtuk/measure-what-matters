import React from "react";
import { cleanup, render } from "@testing-library/react";
import CreateMatch from "../components/match/CreateMatch.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders create match header", () => {
  const { getByText } = render(<CreateMatch />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Create A Match/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders create match button on create match page", () => {
  const { getByText } = render(<CreateMatch />, { wrapper: BrowserRouter });

  const addMatchButton = getByText(/Create Match/i);
  expect(addMatchButton).toBeInTheDocument();
});

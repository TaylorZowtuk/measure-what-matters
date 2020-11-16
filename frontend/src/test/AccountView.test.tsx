import React from "react";
import { cleanup, render } from "@testing-library/react";
import AccountView from "../components/account/AccountView.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders view info header", () => {
  const { getByText } = render(<AccountView />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Account Information/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders input labels correctly", () => {
  const { getByText } = render(
    <BrowserRouter>
      <AccountView />
    </BrowserRouter>
  );

  // username should be displayed
  const username = getByText(/Username:/i);
  expect(username).toBeInTheDocument();

  // first name should be displayed
  const first = getByText(/First Name:/i);
  expect(first).toBeInTheDocument();

  // last name should be displayed
  const last = getByText(/Last Name:/i);
  expect(last).toBeInTheDocument();
});

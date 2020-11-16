import React from "react";
import { cleanup, render } from "@testing-library/react";
import Login from "../components/account/Login.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders login header", () => {
  const { getByText } = render(<Login />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Login/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders login button on login page", () => {
  const { getByText } = render(<Login />, { wrapper: BrowserRouter });

  const loginButton = getByText(/Log In/i);
  expect(loginButton).toBeInTheDocument();
});

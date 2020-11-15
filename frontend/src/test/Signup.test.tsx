import React from "react";
import { cleanup, render } from "@testing-library/react";
import Signup from "../components/account/Signup.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders login header", () => {
  const { getByText } = render(<Signup />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Sign Up/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders login button on login page", () => {
  const { getByText } = render(<Signup />, { wrapper: BrowserRouter });

  const loginButton = getByText(/Sign up/i);
  expect(loginButton).toBeInTheDocument();
});

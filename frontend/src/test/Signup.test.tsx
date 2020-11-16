import React from "react";
import { cleanup, render } from "@testing-library/react";
import Signup from "../components/account/Signup.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders signup header", () => {
  const { getByText } = render(<Signup />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Sign Up/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders signup button on signup page", () => {
  const { getByText } = render(<Signup />, { wrapper: BrowserRouter });

  const signupButton = getByText(/Sign up/i);
  expect(signupButton).toBeInTheDocument();
});

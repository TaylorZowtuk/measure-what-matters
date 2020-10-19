import React from "react";
import { cleanup, render } from "@testing-library/react";
import Recording from "../components/Recording.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders recording screen header", () => {
  const { getByText } = render(<Recording />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Recording/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders dashboard return button on recording screen", () => {
  const { getByText } = render(<Recording />, { wrapper: BrowserRouter });

  const dashboardButton = getByText(/Dashboard/i);
  expect(dashboardButton).toBeInTheDocument();
});

test("renders bench on recording screen", () => {
  const { getByText } = render(<Recording />, { wrapper: BrowserRouter });

  const benchDiv = getByText(/Bench Area/i);
  expect(benchDiv).toBeInTheDocument();
});

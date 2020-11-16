import React from "react";
import { cleanup, render } from "@testing-library/react";
import Teams from "../components/team/Teams.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders teams list header", () => {
  const { getByText } = render(<Teams />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Your Teams/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders dashboard return button on teams list page", () => {
  const { getByText } = render(<Teams />, { wrapper: BrowserRouter });

  const dashboardButton = getByText(/Dashboard/i);
  expect(dashboardButton).toBeInTheDocument();
});

test("renders add team button on teams list page", () => {
  const { getByText } = render(<Teams />, { wrapper: BrowserRouter });

  const addTeamButton = getByText(/Add Team/i);
  expect(addTeamButton).toBeInTheDocument();
});

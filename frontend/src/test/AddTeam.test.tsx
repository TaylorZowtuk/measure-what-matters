import React from "react";
import { cleanup, render } from "@testing-library/react";
import AddTeam from "../components/team/AddTeam.page";
import { BrowserRouter } from "react-router-dom";

afterEach(cleanup);

test("renders add team header", () => {
  const { getByText } = render(<AddTeam />, { wrapper: BrowserRouter });

  const headerElement = getByText(/Add A New Team/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders team list return button on add team page", () => {
  const { getByText } = render(<AddTeam />, { wrapper: BrowserRouter });

  const backButton = getByText(/back/i);
  expect(backButton).toBeInTheDocument();
});

test("renders add team button on add team page", () => {
  const { getByText } = render(<AddTeam />, { wrapper: BrowserRouter });

  const addTeamButton = getByText(/Add Team/i);
  expect(addTeamButton).toBeInTheDocument();
});

import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Router from "../Router";

afterEach(cleanup);

test("navigates from root to recording", () => {
  // Render '/' (dashboard)
  const { getByText } = render(
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );

  // Navigate to '/recording' using a button that says 'Recording'
  const recordingButton = getByText(/Recording/i);
  fireEvent.click(recordingButton);

  // Expect to be on recording page which has a title 'Recording'
  const recordingHeading = getByText(/Recording/i);
  expect(recordingHeading).toHaveTextContent("Recording");
});

test("navigates from recording to root", () => {
  // Render '/recording'
  const { getByText } = render(
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );

  // Navigate to '/' (dashboard)
  const dashboardButton = getByText(/Dashboard/i);
  fireEvent.click(dashboardButton);

  // Expect to be on root page which has a title 'Dashboard Interface'
  const recordingHeading = getByText(/Interface/i);
  expect(recordingHeading).toHaveTextContent("Dashboard Interface");
});

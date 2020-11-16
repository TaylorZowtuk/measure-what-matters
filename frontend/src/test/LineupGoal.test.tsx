//TODO: NEED TO CHANGE
import React from "react";
import { cleanup, render } from "@testing-library/react";
import TimeOnField from "../components/reports/TimeOnField";

afterEach(cleanup);

test("renders a time on field report", () => {
  const { getByText } = render(<TimeOnField />);

  const headerElement = getByText(/Time on Field/i);
  expect(headerElement).toBeInTheDocument();
});

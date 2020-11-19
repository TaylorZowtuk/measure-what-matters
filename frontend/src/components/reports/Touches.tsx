import React from "react";
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  DiscreteColorLegend,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
} from "react-vis";
import { Container } from "react-bootstrap";
import ReportProps from "../interfaces/props/report-props";

type DataType = {
  x: string;
  y: number;
};

export const firstData: DataType[] = [
  { x: "Jim", y: 10 },
  { x: "Bob", y: 5 },
  { x: "Suzie", y: 15 },
  { x: "Neil", y: 15 },
  { x: "Greg", y: 15 },
  { x: "Phil", y: 15 },
  { x: "Jack", y: 15 },
];

export const secondData: DataType[] = [
  { x: "Jim", y: 12 },
  { x: "Bob", y: 2 },
  { x: "Suzie", y: 11 },
  { x: "Neil", y: 21 },
  { x: "Greg", y: 5 },
  { x: "Phil", y: 11 },
  { x: "Jack", y: 3 },
];

export function fetchTouches(debug = true): DataType[][] {
  if (debug) {
    // Return hardcoded values
    return [firstData, secondData];
  }

  // TODO: connect to backend
  return [firstData, secondData];
}

type TouchesBarProps = {
  fetchTouches: Function; // Dependency inject for testing
};

export default function TouchesBar(props: TouchesBarProps & ReportProps) {
  let bothHalvesData: DataType[][] = props.fetchTouches();
  if (!bothHalvesData) {
    bothHalvesData = [];
  }
  return (
    <Container>
      <h4>Number of Touches</h4>
      <FlexibleWidthXYPlot xType="ordinal" height={300} xDistance={100}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={bothHalvesData[0]} barWidth={0.8} />
        <VerticalBarSeries data={bothHalvesData[1]} barWidth={0.8} />
      </FlexibleWidthXYPlot>
      <DiscreteColorLegend
        orientation="horizontal"
        items={[
          {
            title: "First Half",
            color: "#12939A",
          },
          {
            title: "Second Half",
            color: "#79C7E3",
          },
        ]}
      />
    </Container>
  );
}

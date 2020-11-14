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
import { Col, Container, Row } from "react-bootstrap";

type DataType = {
  x: string;
  y: number;
};

const firstData: DataType[] = [
  { x: "Jim", y: 10 },
  { x: "Bob", y: 5 },
  { x: "Suzie", y: 15 },
  { x: "Neil", y: 15 },
  { x: "Greg", y: 15 },
  { x: "Phil", y: 15 },
  { x: "Jack", y: 15 },
];

const secondData: DataType[] = [
  { x: "Jim", y: 12 },
  { x: "Bob", y: 2 },
  { x: "Suzie", y: 11 },
  { x: "Neil", y: 21 },
  { x: "Greg", y: 5 },
  { x: "Phil", y: 11 },
  { x: "Jack", y: 3 },
];

function fetchTouches(debug = true): DataType[][] {
  if (debug) {
    // Return hardcoded values
    return [firstData, secondData];
  }

  // TODO: connect to backend
  return [firstData, secondData];
}

export default function TouchesBar() {
  let bothHalvesData: DataType[][] = fetchTouches();
  return (
    <Container>
      <h4>Number of Touches</h4>
      <Row>
        <FlexibleWidthXYPlot xType="ordinal" height={300} xDistance={100}>
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
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <VerticalBarSeries data={bothHalvesData[0]} barWidth={0.8} />
          <VerticalBarSeries data={bothHalvesData[1]} barWidth={0.8} />
        </FlexibleWidthXYPlot>
      </Row>
    </Container>
  );
}

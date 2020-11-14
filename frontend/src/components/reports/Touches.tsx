import React, { useState } from "react";
import { RadialChart, makeWidthFlexible, Hint } from "react-vis";
import { Col, Container, Row } from "react-bootstrap";

type DataType = {
  angle: number; // Same value as touches
  touches: number; // Number of counts of this player getting possession of the ball
  name: string;
};
function fetchData(debug = true): DataType[] {
  console.log("Fetch");
  if (debug) {
    return [
      { angle: 7, touches: 7, name: "jim" },
      { angle: 3, touches: 3, name: "bob" },
      { angle: 6, touches: 6, name: "greg" },
      { angle: 0, touches: 0, name: "george" },
    ];
  }

  // TODO: connect to backend
  return [
    { angle: 7, touches: 7, name: "jim" },
    { angle: 3, touches: 3, name: "bob" },
    { angle: 6, touches: 6, name: "greg" },
    { angle: 0, touches: 0, name: "george" },
  ];
}

const FlexRadialChart = makeWidthFlexible(RadialChart);

type Line = {
  title: string;
  value: string;
};

// Format function for a tooltip. Receives the data point,
// should return an array of objects containing title and value properties.
function formatData(data: DataType): Line[] {
  let a: Line[] = [];
  let line: Line = { title: "Player", value: data.name }; // Name
  a.push(line);
  line = { title: "# Touches", value: data.touches.toString() };
  a.push(line);
  return a;
}

export default function TouchesRadial() {
  const data = fetchData();

  const [hoveredPoint, setHoveredPoint] = useState<DataType | null>();

  return (
    <Container>
      <h4>Number of Touches</h4>
      <Row>
        <Col>
          <h5>First Half</h5>
          <FlexRadialChart
            data={data}
            innerRadius={50}
            radius={70}
            height={200}
            onMouseLeave={() => setHoveredPoint(null)}
            onValueMouseOver={(d: DataType) =>
              setHoveredPoint({
                angle: d.angle,
                touches: d.touches,
                name: d.name,
              })
            }
            // onMouseLeave={() => console.log("Leave")}
            // onValueMouseOver={(d: DataType) => console.log(d)}
          >
            {hoveredPoint && (
              <Hint
                value={hoveredPoint}
                format={formatData}
                align={{ vertical: "top", horizontal: "left" }}
                style={{ fontSize: 24 }}
              ></Hint>
            )}
          </FlexRadialChart>
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Second Half</h5>
          <FlexRadialChart
            data={data}
            innerRadius={50}
            radius={70}
            height={200}
            showLabels={true}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <h5>Overall</h5>
          <FlexRadialChart
            data={data}
            innerRadius={50}
            radius={70}
            height={200}
            showLabels={true}
          />
        </Col>
      </Row>
    </Container>
  );
}

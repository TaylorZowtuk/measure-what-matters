import React, { useEffect, useState } from "react";
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
import axios from "axios";
import authHeader from "../../services/auth.header";
import { playerTouchDTO, touchesDTO } from "../interfaces/touches";

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

function formatData(data: touchesDTO): DataType[][] {
  let first: DataType[] = [];
  let second: DataType[] = [];
  for (let i = 0; i < data.firstHalfTouches.length; i++) {
    let firstPlayerAndTouches: playerTouchDTO = data.firstHalfTouches[i];
    // If the player represents their team, then ignore
    if (!firstPlayerAndTouches.player) continue;
    let secondPlayerAndTouches: playerTouchDTO = data.secondHalfTouches[i];
    let player = firstPlayerAndTouches.player;
    // Create a shorthand string of the player initials and number
    let name: string =
      player.firstName[0] +
      "." +
      player.lastName[0] +
      "." +
      " #" +
      player.jerseyNum;
    console.log(name);
    let firstObservation: DataType = {
      x: name,
      y: firstPlayerAndTouches.touches,
    };
    let secondObservation: DataType = {
      x: name,
      y: secondPlayerAndTouches.touches,
    };
    first[i] = firstObservation;
    second[i] = secondObservation;
  }
  return [first, second];
}

export async function fetchTouches(
  matchId: number,
  debug = false
): Promise<DataType[][]> {
  if (debug) {
    // Return hardcoded values
    return [firstData, secondData];
  }

  const res = await axios.get(`/player-stats/touches?matchId=${matchId}`, {
    headers: authHeader(),
  });
  let resData: touchesDTO = res.data;
  console.log("Get touches response:", resData); // Handle errors

  return formatData(resData);
}

type TouchesBarProps = {
  fetchTouches: Function; // Dependency inject for testing
};

export default function TouchesBar(props: TouchesBarProps & ReportProps) {
  const [bothHalvesData, setTouches] = useState<DataType[][] | null>(null);
  useEffect(() => {
    async function getTouches() {
      if (props.matchId) {
        setTouches(await props.fetchTouches(props.matchId));
      }
    }
    getTouches();
  }, [props]);

  if (!bothHalvesData) {
    return null;
  }
  console.log(bothHalvesData);
  return (
    <Container>
      <h4>Number of Touches</h4>
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
      <FlexibleWidthXYPlot xType="ordinal" height={300} xDistance={100}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={bothHalvesData[0]} barWidth={0.8} />
        <VerticalBarSeries data={bothHalvesData[1]} barWidth={0.8} />
      </FlexibleWidthXYPlot>
    </Container>
  );
}

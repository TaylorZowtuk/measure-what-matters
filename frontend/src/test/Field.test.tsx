import React from "react";
import { cleanup, render } from "@testing-library/react";
import Player, { createPlayerDraggable } from "../components/Player";
import { FieldTarget } from "../components/Field";
import { DraggableTypes } from "../constants";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const roster: Player[] = [
  {
    firstName: "Charlie",
    lastName: "Whittle",
    num: 0,
    team: "ours",
    playerId: 1,
  },
  {
    firstName: "Mac",
    lastName: "Ferguson",
    num: 1,
    team: "ours",
    playerId: 2,
  },
  {
    firstName: "Dee",
    lastName: "Barnes",
    num: 2,
    team: "ours",
    playerId: 2,
  },
  {
    firstName: "Dennis",
    lastName: "Yang",
    num: 3,
    team: "ours",
    playerId: 3,
  },
  {
    firstName: "Aman",
    lastName: "Luna",
    num: 4,
    team: "ours",
    playerId: 4,
  },
  {
    firstName: "Taylor",
    lastName: "Wilkins",
    num: 5,
    team: "ours",
    playerId: 5,
  },
];

afterEach(cleanup);

test("renders player draggables on the field", () => {
  // Create mock player draggables
  let draggablePlayers: any[] = createPlayerDraggable(roster);

  const { getByText } = render(
    <DndProvider backend={HTML5Backend}>
      <FieldTarget
        draggablePlayers={draggablePlayers}
        incrementScore={() => {}}
        getLineup={() => {}}
      />
    </DndProvider>
  );

  for (let i = 0; i < draggablePlayers.length; i++) {
    // Each player should appear as a button on the field
    const teamName = getByText(
      new RegExp(draggablePlayers[i].props.firstName, "i")
    );
    expect(teamName).toBeInTheDocument();
  }
});

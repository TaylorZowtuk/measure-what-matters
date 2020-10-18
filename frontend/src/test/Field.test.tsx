import React from "react";
import { cleanup, render } from "@testing-library/react";
import Player, { createPlayerDraggable } from "../components/Player";
import { FieldTarget } from "../components/Field";
import { DraggableTypes } from "../constants";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const roster: Player[] = [
  {
    first_name: "Charlie",
    last_name: "Whittle",
    num: 0,
    team: "ours",
    playerId: 1,
  },
  {
    first_name: "Mac",
    last_name: "Ferguson",
    num: 1,
    team: "ours",
    playerId: 2,
  },
  {
    first_name: "Dee",
    last_name: "Barnes",
    num: 2,
    team: "ours",
    playerId: 2,
  },
  {
    first_name: "Dennis",
    last_name: "Yang",
    num: 3,
    team: "ours",
    playerId: 3,
  },
  {
    first_name: "Aman",
    last_name: "Luna",
    num: 4,
    team: "ours",
    playerId: 4,
  },
  {
    first_name: "Taylor",
    last_name: "Wilkins",
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
      new RegExp(draggablePlayers[i].props.first_name, "i")
    );
    expect(teamName).toBeInTheDocument();
  }
});

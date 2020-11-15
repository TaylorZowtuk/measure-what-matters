import React from "react";
import { cleanup, render } from "@testing-library/react";
import Player, { createPlayerDraggables } from "../components/recording/Player";
import { FieldTarget } from "../components/recording/Field";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CircularBuffer from "../util/circular-buffer";

const roster: Player[] = [
  {
    firstName: "Charlie",
    lastName: "Whittle",
    jerseyNum: 0,
    teamId: 1,
    playerId: 1,
  },
  {
    firstName: "Mac",
    lastName: "Ferguson",
    jerseyNum: 1,
    teamId: 1,
    playerId: 2,
  },
  {
    firstName: "Dee",
    lastName: "Barnes",
    jerseyNum: 2,
    teamId: 1,
    playerId: 2,
  },
  {
    firstName: "Dennis",
    lastName: "Yang",
    jerseyNum: 3,
    teamId: 1,
    playerId: 3,
  },
  {
    firstName: "Aman",
    lastName: "Luna",
    jerseyNum: 4,
    teamId: 1,
    playerId: 4,
  },
  {
    firstName: "Taylor",
    lastName: "Wilkins",
    jerseyNum: 5,
    teamId: 1,
    playerId: 5,
  },
];

afterEach(cleanup);

test("renders player draggables on the field", () => {
  // Create mock player draggables
  let draggablePlayers: any[] = createPlayerDraggables(roster, () => {});
  const { getByText } = render(
    <DndProvider backend={HTML5Backend}>
      <FieldTarget
        enterShootingState={() => {}}
        resetPlayerWithPossession={() => {}}
        draggablePlayers={draggablePlayers}
        getLineup={() => {}}
        previousPossessions={new CircularBuffer(0)}
      />
    </DndProvider>
  );
  for (let i = 0; i < draggablePlayers.length; i++) {
    // Each player should appear as a button on the field

    const firstName = getByText(
      new RegExp(draggablePlayers[i].props.player.firstName, "i")
    );
    expect(firstName).toBeInTheDocument();
  }
});

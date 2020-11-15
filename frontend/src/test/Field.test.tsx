import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import Player, { createPlayerDraggables } from "../components/recording/Player";
import Field, { FieldTarget } from "../components/recording/Field";
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
    const firstName = getByText(
      new RegExp(draggablePlayers[i].props.player.firstName, "i")
    );

    // Each player should appear as a button on the field
    expect(firstName).toBeInTheDocument();
  }
});

test("does not render player draggables on the field when in shooting state", () => {
  // Create mock player draggables
  let draggablePlayers: any[] = createPlayerDraggables(roster, () => {});
  const { getByText } = render(
    <DndProvider backend={HTML5Backend}>
      <Field
        matchId={1}
        getStartingLine={() => {
          return draggablePlayers;
        }}
        inShootingState={true}
        enterShootingState={() => {}}
        removeFromField={undefined}
        addToField={undefined}
        resetSubs={() => {}}
      />
    </DndProvider>
  );

  for (let i = 0; i < draggablePlayers.length; i++) {
    const firstName = screen.queryByText(
      new RegExp(draggablePlayers[i].props.player.firstName, "i")
    );

    // Each player should appear as a button on the field if we are not in the shooting state
    // But when we are in the shooting state the field should be hidden
    expect(firstName).not.toBeInTheDocument();
  }
});

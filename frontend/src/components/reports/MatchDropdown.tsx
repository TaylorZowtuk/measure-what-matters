import React, { useEffect, useState } from "react";
import axios from "axios";
import { MatchDTO } from "../interfaces/match";
import authHeader from "../../services/auth.header";
import { TeamDTO } from "../interfaces/team";
import { Dropdown } from "react-bootstrap";

type MatchAndTeam = {
  match: MatchDTO;
  teamName: string;
};

interface Props {
  matchId?: number;
  handleMatchIdChange(matchId: number): void;
}

// Get all the users upcoming matches for every team they are a part of
async function fetchMatches(): Promise<MatchAndTeam[]> {
  let matches: MatchAndTeam[] = [];

  // Get all the users teams
  const teamsRes = await axios.get(
    `/api/teams?userId=1`, // TODO: Remove hardcoded userId
    { headers: authHeader() }
  ); // TODO: catch error and handle
  console.log("Get teams response:", teamsRes);
  const teamsData: TeamDTO[] = teamsRes.data;

  // For each team get all matches
  for (let i = 0; i < teamsData.length; i++) {
    const matchesRes = await axios.get(
      `/api/match/teamId?teamId=${teamsData[i].teamId}`,
      { headers: authHeader() }
    ); // TODO: catch error and handle
    console.log("Get matches response:", matchesRes);
    const matchesData: MatchDTO[] = matchesRes.data;
    for (let j = 0; j < matchesData.length; j++)
      matches.push({ match: matchesData[j], teamName: teamsData[i].name });
  }

  // Filter completed matches and sort by upcoming
  matches = filterOutUnfinishedGames(matches);
  matches = sortUpcoming(matches);
  return matches;
}

// Remove games that haven't been recorded already from matches
function filterOutUnfinishedGames(matches: MatchAndTeam[]): MatchAndTeam[] {
  matches = matches.filter(
    (matchAndTeam) => matchAndTeam.match.fullTime !== null
  );
  return matches;
}

// Sort matches by earliest start time first
function sortUpcoming(matches: MatchAndTeam[]): MatchAndTeam[] {
  return matches.sort(function (a, b) {
    return a.match.scheduledTime - b.match.scheduledTime;
  });
}

function getSelectionBoxText(matchAndTeam: MatchAndTeam): string {
  return `${matchAndTeam.teamName} vs ${
    matchAndTeam.match.opponentTeamName
  } | ${new Date(matchAndTeam.match.scheduledTime * 1000).toLocaleString()} `;
}

export default function MatchDropdown(props: Props) {
  const [matches, setMatches] = useState<MatchAndTeam[] | null>(null);
  useEffect(() => {
    async function getMatches() {
      setMatches(await fetchMatches());
    }
    getMatches();
  }, []);

  const [dropdownText, setDropdownText] = useState<string>("Stats By Match");

  // If fetch request hasnt returned yet
  if (!matches) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {dropdownText}
        </Dropdown.Toggle>
      </Dropdown>
    );
  } else {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {dropdownText}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {matches.length > 0 ? (
            matches.map((matchAndTeam: MatchAndTeam) => (
              <Dropdown.Item
                as="button"
                onSelect={() => {
                  props.handleMatchIdChange(matchAndTeam.match.matchId);
                  setDropdownText(getSelectionBoxText(matchAndTeam));
                }}
              >
                {getSelectionBoxText(matchAndTeam)}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.ItemText>
              There are no completed matches.
            </Dropdown.ItemText>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

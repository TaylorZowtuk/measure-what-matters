import React, { useEffect, useState } from "react";
import axios from "axios";
import { MatchDTO } from "../interfaces/match";
import authHeader from "../../services/auth.header";
import { TeamDTO } from "../interfaces/team";
import { Dropdown } from "react-bootstrap";

// Icons from: https://icons8.com

type MatchAndTeam = {
  match: MatchDTO;
  teamName: string;
};

export const MatchReportContext = React.createContext(1); //exporting context object

// Get all the users upcoming matches for every team they are a part of
async function fetchMatches(): Promise<MatchAndTeam[]> {
  let matches: MatchAndTeam[] = [];

  // Get all the users teams
  const teamsRes = await axios.get(
    `/teams?userId=1`, // TODO: Remove hardcoded userId
    { headers: authHeader() }
  ); // TODO: catch error and handle
  console.log("Get teams response:", teamsRes);
  const teamsData: TeamDTO[] = teamsRes.data;

  // For each team get all matches
  for (let i = 0; i < teamsData.length; i++) {
    const matchesRes = await axios.get(
      `/match/teamId?teamId=${teamsData[i].teamId}`,
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

// Remove games that have been recorded already from matches
function filterOutUnfinishedGames(matches: MatchAndTeam[]): MatchAndTeam[] {
  matches = matches.filter(
    (matchAndTeam) => matchAndTeam.match.fullTime === null
  );
  return matches;
}

// Sort matches by earliest start time first (when matches include only upcoming matches,
// this ordering means upcoming first)
function sortUpcoming(matches: MatchAndTeam[]): MatchAndTeam[] {
  return matches.sort(function (a, b) {
    return a.match.startTime - b.match.startTime;
  });
}

export default function MatchDropdown() {
  const [matches, setMatches] = useState<MatchAndTeam[] | null>(null);
  useEffect(() => {
    async function getMatches() {
      setMatches(await fetchMatches());
    }
    getMatches();
  }, []);

  const [matchId, setMatchId] = useState<number>(1);

  // If fetch request hasnt returned yet
  if (!matches) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <MatchReportContext.Provider value={matchId}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Stats By Match
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {matches.map((matchAndTeam: MatchAndTeam) => (
              <Dropdown.Item
                as="button"
                onSelect={() => setMatchId(matchAndTeam.match.matchId)}
              >
                {`${matchAndTeam.teamName} vs Opponent: `}
                {new Date(matchAndTeam.match.startTime).toString()}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </MatchReportContext.Provider>
    );
  }
}

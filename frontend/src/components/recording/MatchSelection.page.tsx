import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import authHeader from "../../services/auth.header";
import axios from "axios";
import LineupProps from "../interfaces/props/lineup-props";
import { MatchDTO } from "../interfaces/match";
import { TeamDTO } from "../interfaces/team";

// Icons from: https://icons8.com

export default function MatchSelection() {
  return (
    <div>
      <h1>Upcoming Matches</h1>
      <h5>Select a match to begin</h5>
      <AlignItemsList />
      <Link to="/dashboard">
        <Button variant="contained">Back</Button>
      </Link>
    </div>
  );
}

type MatchAndTeam = {
  match: MatchDTO;
  teamName: string;
};

// Get all the users upcoming matches for every team they are a part of
async function fetchMatches(debug = false): Promise<MatchAndTeam[]> {
  let matches: MatchAndTeam[] = [];

  if (debug) {
    matches = debugData;
  } else {
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
  }

  // Filter completed matches and sort by upcoming
  matches = filterOutFinishedGames(matches);
  matches = sortUpcoming(matches);
  return matches;
}

// Remove games that have been recorded already from matches
function filterOutFinishedGames(matches: MatchAndTeam[]): MatchAndTeam[] {
  matches = matches.filter(
    (matchAndTeam) => matchAndTeam.match.fullTime === null
  );
  return matches;
}

// Sort matches by earliest start time first (when matches include only upcoming matches,
// this ordering means upcoming first)
function sortUpcoming(matches: MatchAndTeam[]): MatchAndTeam[] {
  return matches.sort(function (a, b) {
    return a.match.scheduledTime - b.match.scheduledTime;
  });
}

function getImagePath(weekday: string) {
  let calendarImgPath;
  switch (
    weekday // Set the calendar icon according to the start time weekday
  ) {
    case "Monday": {
      calendarImgPath = require("../../static/imgs/icons8-monday-100.png");
      break;
    }
    case "Tuesday": {
      calendarImgPath = require("../../static/imgs/icons8-tuesday-100.png");
      break;
    }
    case "Wednesday": {
      calendarImgPath = require("../../static/imgs/icons8-wednesday-100.png");
      break;
    }
    case "Thursday": {
      calendarImgPath = require("../../static/imgs/icons8-thursday-100.png");
      break;
    }
    case "Friday": {
      calendarImgPath = require("../../static/imgs/icons8-friday-100.png");
      break;
    }
    case "Saturday": {
      calendarImgPath = require("../../static/imgs/icons8-saturday-100.png");
      break;
    }
    case "Sunday": {
      calendarImgPath = require("../../static/imgs/icons8-sunday-100.png");
      break;
    }
  }
  return calendarImgPath;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

export function AlignItemsList() {
  const classes = useStyles();
  const history = useHistory();

  const [matches, setMatches] = useState<MatchAndTeam[] | null>(null);
  useEffect(() => {
    async function getMatches() {
      setMatches(await fetchMatches());
    }
    getMatches();
  }, []);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
    matchAndTeam: MatchAndTeam
  ) => {
    const lineupProps: LineupProps = {
      matchId: matchAndTeam.match.matchId.toString(),
      teamId: matchAndTeam.match.teamId.toString(),
    };
    history.push("/match/lineup", lineupProps);
  };

  // If fetch request hasnt returned yet
  if (!matches) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <List className={classes.root}>
        {matches.map((matchAndTeam: MatchAndTeam, index: number) => {
          const date = new Date(matchAndTeam.match.scheduledTime * 1000); // The epoch start time of this match
          const weekday: string = date.toLocaleString("en-us", {
            weekday: "long",
          });
          const calendarImgPath = getImagePath(weekday);
          return (
            <>
              <ListItem
                alignItems="flex-start"
                onClick={(event) =>
                  handleListItemClick(event, index, matchAndTeam)
                }
                key={`item-${matchAndTeam.match.teamId}-${matchAndTeam.match.matchId}`}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    alt={weekday} // String of the day of week
                    src={calendarImgPath}
                    key={`item-${matchAndTeam.match.teamId}-${matchAndTeam.match.matchId}-avatar`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={date.toLocaleString()} // Formatted date time in local timezone
                  primaryTypographyProps={{ color: "textPrimary" }}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {matchAndTeam.teamName} vs.
                        {matchAndTeam.match.opponentTeamName}
                        {/* TODO: add their team name */}
                      </Typography>
                      <br></br>
                      {matchAndTeam.match.isHomeTeam ? "Home" : "Away"}{" "}
                      {" Game"}
                    </React.Fragment>
                  }
                  key={`item-${matchAndTeam.match.teamId}-${matchAndTeam.match.matchId}-text`}
                />
              </ListItem>
              <Divider
                variant="inset"
                component="li"
                key={`item-${matchAndTeam.match.teamId}-${matchAndTeam.match.matchId}-divider`}
              />
            </>
          );
        })}
      </List>
    );
  }
}

const debugData: MatchAndTeam[] = [
  {
    match: {
      matchId: 1,
      team: null,
      teamId: 4,
      scheduledTime: Date.now(),
      startTime: null,
      halfTime: null,
      fullTime: null,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Teal Traitors",
  },
  {
    match: {
      matchId: 1,
      team: null,
      teamId: 1,
      scheduledTime: 46544654,
      opponentTeamName: "Rad Boys",
      isHomeTeam: true,
      startTime: null,
      halfTime: null,
      fullTime: null,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Red Rovers",
  },
  {
    match: {
      matchId: 2,
      team: null,
      teamId: 1,
      scheduledTime: 123456,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      startTime: null,
      halfTime: null,
      fullTime: null,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Red Rovers",
  },
  {
    match: {
      matchId: 2,
      team: null,
      teamId: 2,
      scheduledTime: 1234561,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      startTime: 12343,
      halfTime: 12344,
      fullTime: 12345,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Pink Pansies",
  },
  {
    match: {
      matchId: 1,
      team: null,
      teamId: 2,
      scheduledTime: 1234561,
      opponentTeamName: "Rad Boys",
      isHomeTeam: true,
      startTime: null,
      halfTime: null,
      fullTime: null,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Pink Pansies",
  },
  {
    match: {
      matchId: 3,
      team: null,
      teamId: 1,
      scheduledTime: 1234561,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      startTime: null,
      halfTime: null,
      fullTime: null,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Red Rovers",
  },
  {
    match: {
      matchId: 1,
      team: null,
      teamId: 4,
      scheduledTime: 12311,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      startTime: 123633,
      halfTime: 126336,
      fullTime: null,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Yellow Bellies",
  },
  {
    match: {
      matchId: 1,
      team: null,
      teamId: 3,
      scheduledTime: 12345235,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      startTime: 1233,
      halfTime: 12344,
      fullTime: 12345,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Green Gadzooks",
  },
  {
    match: {
      matchId: 1,
      team: null,
      teamId: 3,
      scheduledTime: 123,
      opponentTeamName: "Rad Boys",
      isHomeTeam: false,
      startTime: null,
      halfTime: null,
      fullTime: null,
      createdDate: "12345",
      updatedDate: "12345",
    },
    teamName: "Green Gadzooks",
  },
];

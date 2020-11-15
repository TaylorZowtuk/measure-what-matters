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
      <h1>Upcoming Games</h1>
      <AlignItemsList />
      <Link
        to={{
          pathname: "/recording",
          state: {
            matchId: 1,
            teamId: 1,
          },
        }}
      >
        <Button variant="contained">Recording</Button>
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
    return a.match.startTime - b.match.startTime;
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
          const date = new Date(matchAndTeam.match.startTime); // The epoch start time of this match
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
                key={index}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    alt={weekday} // String of the day of week
                    src={calendarImgPath}
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
                        {matchAndTeam.teamName} vs.{" "}
                        {/* TODO: add their team name */}
                      </Typography>
                      <br></br>
                      {matchAndTeam.match.isHomeTeam ? "Home" : "Away"}{" "}
                      {" Game"}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
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
      teamId: 4,
      startTime: Date.now(),
      isHomeTeam: false,
      halfTime: null,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Teal Traitors",
  },
  {
    match: {
      matchId: 1,
      teamId: 1,
      startTime: 46544654,
      isHomeTeam: true,
      halfTime: null,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Red Rovers",
  },
  {
    match: {
      matchId: 2,
      teamId: 1,
      startTime: 123456,
      isHomeTeam: false,
      halfTime: null,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Red Rovers",
  },
  {
    match: {
      matchId: 2,
      teamId: 2,
      startTime: 1234561,
      isHomeTeam: false,
      halfTime: 12344,
      fullTime: 12345,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Pink Pansies",
  },
  {
    match: {
      matchId: 1,
      teamId: 2,
      startTime: 1234561,
      isHomeTeam: true,
      halfTime: null,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Pink Pansies",
  },
  {
    match: {
      matchId: 3,
      teamId: 1,
      startTime: 1234561,
      isHomeTeam: false,
      halfTime: null,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Red Rovers",
  },
  {
    match: {
      matchId: 1,
      teamId: 4,
      startTime: 12311,
      isHomeTeam: false,
      halfTime: 126336,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Yellow Bellies",
  },
  {
    match: {
      matchId: 1,
      teamId: 3,
      startTime: 12345235,
      isHomeTeam: false,
      halfTime: 12344,
      fullTime: 12345,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Green Gadzooks",
  },
  {
    match: {
      matchId: 1,
      teamId: 3,
      startTime: 123,
      isHomeTeam: false,
      halfTime: null,
      fullTime: null,
      createdDate: 12345,
      updatedDate: 12345,
    },
    teamName: "Green Gadzooks",
  },
];

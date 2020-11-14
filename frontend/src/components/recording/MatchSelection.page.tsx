import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

type MatchDTO = {
  matchId: number;
  teamId: number;
  startTime: number;
  isHomeTeam: boolean;
  halfTime: number;
  fullTime: number;
  createdDate: number;
  updatedDate: number;
};

type TeamDTO = {
  teamId: number;
  name: string;
};

// Get all the users upcoming matches for every team they are a part of
async function fetchMatches(debug = false): Promise<MatchDTO[]> {
  // Get all the users teams
  const teamsRes = await axios.get(
    `/teams?userId=1`, // TODO: Remove hardcoded userId
    { headers: authHeader() }
  ); // TODO: catch error and handle
  console.log("Get teams response:", teamsRes);
  const teamsData: TeamDTO[] = teamsRes.data;

  let matches: MatchDTO[] = [];
  // For each team get all matches
  for (let i = 0; i < teamsRes.data.length; i++) {
    const matchesRes = await axios.get(
      `/match/teamId?teamId=${teamsData[i].teamId}`,
      { headers: authHeader() }
    ); // TODO: catch error and handle
    console.log("Get matches response:", matchesRes);
    const matchesData: MatchDTO[] = matchesRes.data;
    for (let j = 0; j < matchesData.length; j++) matches.push(matchesData[j]);
  }
  // TODO: filter completed matches and sort by upcoming
  return matches;
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

  const [matches, setMatches] = useState<MatchDTO[] | null>(null);
  useEffect(() => {
    async function getMatches() {
      setMatches(await fetchMatches());
    }
    getMatches();
  }, []);

  // If fetch request hasnt returned yet
  if (!matches) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <List className={classes.root}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Summer BBQ"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Oui Oui"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Sandra Adams
                </Typography>
                {" — Do you have Paris recommendations? Have you ever…"}
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    );
  }
}

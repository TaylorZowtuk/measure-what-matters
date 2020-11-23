import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems, secondaryListItems } from "./ListItems";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-front",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Guide() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        textAlign: "left",
        width: "100%",
      }}
    >
      <div className={classes.root}>
        <CssBaseline />
        {/* <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Guide
            </Typography>
          </Toolbar>
        </AppBar> */}
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <h3 style={{ margin: 0 }}>Guide</h3>
          </div>
          <Divider />
          <List>{mainListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <div
                style={{
                  backgroundColor: "white",
                  color: "black",
                  width: "100%",
                }}
              >
                {/* log in guide */}
                <h3
                  id="start"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Log in
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  Before trying to access Measure What Matters features, log in
                  using your credentials.
                </p>
                <img
                  src={require("./images/login.png")}
                  alt="log in form"
                  width="300px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  If you don't have an account, click on "sign up here" to
                  create an account.
                </p>
                {/* sign up guide */}
                <h3
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Sign up
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To create an account, you need to enter your first name, last
                  name, username, and password. After you enter all the
                  information, click the sign up button.
                </p>
                <img
                  src={require("./images/signup.png")}
                  alt="sign up form"
                  width="300px"
                  style={{ margin: "10px" }}
                ></img>
                {/* Dashboard guide */}
                <h3
                  id="dashboard"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Dashboard
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  After signing in, you will see the main dashboard. This is
                  where you will access the Measure What Matters features. To
                  see stats, you will need to select a match first.
                </p>
                <img
                  src={require("./images/dashboard-match.png")}
                  alt="dashboard select match"
                  width="600px"
                  style={{ margin: "10px" }}
                ></img>
                {/* Create Match guide */}
                <h3
                  id="create-match"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Create Match
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  Before you can start to record a match, you need to create a
                  match to be recorded. To do this, click the Create Match
                  button on dashboard.
                </p>
                <img
                  src={require("./images/dashboard-create-match.png")}
                  alt="dashboard create match"
                  width="600px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To create a match, select the team of yours to play, enter
                  your opponent team's name, select if you are playing home or
                  away, then select the date and time you are playing. After
                  that, click Create Match.
                </p>
                <img
                  src={require("./images/create-match.png")}
                  alt="create match"
                  width="300px"
                  style={{ margin: "10px" }}
                ></img>
                {/* Recording guide */}
                <h3
                  id="recording"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Recording
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To start to record a game, click the Recording button on
                  dashboard.
                </p>
                <img
                  src={require("./images/dashboard-recording.png")}
                  alt="dashboard recording button"
                  width="600px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  Then select a match you want to record by simply clicking on
                  one.
                </p>
                <img
                  src={require("./images/recording-select-match.png")}
                  alt="select match"
                  width="400px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  After that, select at least 7 players from the team roster
                  that are playing this match.
                </p>
                <img
                  src={require("./images/create-lineup.png")}
                  alt="create lineup"
                  width="700px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  You can now record the match.
                </p>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To indicate someone on your team has the ball, simply click
                  their name. If the opponent has the ball, click the opposition
                  button.
                </p>
                <img
                  src={require("./images/ball-possesion.png")}
                  alt="ball possesion"
                  width="900px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  If someone makes a shot, you can click and drag the name in
                  any direction. Then select the result for the shot.
                </p>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  (Note: the one you are dragging must have the ball and is
                  indicated by clicking on it)
                </p>
                <img
                  src={require("./images/shot.png")}
                  alt="make a shot"
                  width="500px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To make a substitution, you click and drag a player to the
                  bench area.
                </p>
                <img
                  src={require("./images/substitution-bench.png")}
                  alt="substitute to bench"
                  width="900px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  Then select a player from the bench.
                </p>
                <img
                  src={require("./images/substitution.png")}
                  alt="substitute to bench"
                  width="900px"
                  style={{ margin: "10px" }}
                ></img>
                {/* Teams guide */}
                <h3
                  id="teams"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Teams
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  You can see all your teams and players on the teams page.
                  Click on the Teams button and you will be directed to the
                  teams page.
                </p>
                <img
                  src={require("./images/dashboard-teams.png")}
                  alt="dashboard teams button"
                  width="600px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To edit roster for your team, click the Edit Roster button and
                  you can add players to or delete players from the team. You
                  can also change player names and their jersey numbers.
                </p>
                <div style={{ display: "block" }}>
                  <img
                    src={require("./images/teams.png")}
                    alt="teams page"
                    width="400px"
                    style={{ margin: "10px" }}
                  ></img>
                  <img
                    src={require("./images/edit-roster.png")}
                    alt="edit roster"
                    width="700px"
                    style={{ margin: "10px" }}
                  ></img>
                </div>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  To add a team, click the Add Team button on Teams page. You
                  need to enter a unique team name. You can add players to it
                  while you are creating the team.
                </p>
                <img
                  src={require("./images/add-team.png")}
                  alt="add team"
                  width="600px"
                  style={{ margin: "10px" }}
                ></img>
                {/* View/Edit Account guide */}
                <h3
                  id="account"
                  style={{
                    backgroundColor: "grey",
                    color: "white",
                    padding: "8px",
                    margin: 0,
                  }}
                >
                  Account
                </h3>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  You can view your account info by clicking the Account button
                  on dashboard.
                </p>
                <img
                  src={require("./images/dashboard-account.png")}
                  alt="dashboard account button"
                  width="600px"
                  style={{ margin: "10px" }}
                ></img>
                <p style={{ fontSize: "18px", margin: 0, padding: "8px" }}>
                  This page will show your username and your name. You can edit
                  your name by clicking the edit icon.
                </p>
              </div>
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.page";
import Recording from "./components/recording/Recording.page";
import Login from "./components/Login/Login.page";
import Teams from "./components/Teams/Teams.page";
import AddTeam from "./components/AddTeam/AddTeam.page";
import Signup from "./components/Signup/Signup.page";
import MatchSelection from "./components/recording/MatchSelection.page";
import Roster from "./components/Roster/Roster";
import CreateMatch from "./components/match/CreateMatch.page";
import AccountView from "./components/account/AccountView.page";
import LineupComponent from "./components/recording/Lineup.page";

const Router = () => {
  return (
    <Switch>
      {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/dashboard" component={Dashboard}></Route>
      <Route exact path="/teams" component={Teams}></Route>
      <Route exact path="/create-team" component={AddTeam}></Route>
      <Route exact path="/matches/upcoming" component={MatchSelection}></Route>
      <Route exact path="/match/lineup" component={LineupComponent}></Route>
      <Route exact path="/match/recording" component={Recording}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <Route exact path="/teams/roster" component={Roster}></Route>
      <Route exact path="/create-match" component={CreateMatch}></Route>
      <Route exact path="/view-account" component={AccountView}></Route>
    </Switch>
  );
};

export default Router;

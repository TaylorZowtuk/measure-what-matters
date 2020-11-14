import React from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.page";
import Recording from "./components/Recording.page";
import Login from "./components/Login/Login.page";
import Teams from "./components/Teams/Teams.page";
import AddTeam from "./components/AddTeam/AddTeam.page";
import Signup from "./components/Signup/Signup.page";
import MatchSelection from "./components/recording/MatchSelection.page";

const Router = () => {
  return (
    <Switch>
      {" "}
      {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/dashboard" component={Dashboard}></Route>
      <Route exact path="/teams" component={Teams}></Route>
      <Route exact path="/create-team" component={AddTeam}></Route>
      <Route exact path="/upcoming" component={MatchSelection}></Route>
      <Route exact path="/recording" component={Recording}></Route>
      <Route exact path="/signup" component={Signup}></Route>
    </Switch>
  );
};

export default Router;

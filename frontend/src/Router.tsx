import React from "react";
import { Switch, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard.page";
import Recording from "./components/Recording.page";

const Router = () => {
  return (
    <Switch>
      {" "}
      {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path="/" component={Dashboard}></Route>
      <Route
        exact
        path="/recording"
        render={(props) => <Recording matchId={1} teamId={1} />} // TODO: Remove hardcoded matchId and teamId
      ></Route>
    </Switch>
  );
};

export default Router;

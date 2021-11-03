import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { TopPage } from "./page/top-page";
import { GamePage } from "./page/game-page";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={TopPage} />
        <Route exact path="/game" component={GamePage} />
      </Switch>
    </BrowserRouter>
  );
};
// ========================================

ReactDOM.render(<App />, document.getElementById("root"));

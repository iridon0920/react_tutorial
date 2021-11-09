import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { TopPage } from "./top/page/top-page";
import { GamePage } from "./game/page/game-page";
import { BookListPage } from "./book-list/page/book-list-page";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={TopPage} />
        <Route exact path="/game" component={GamePage} />
        <Route exact path="/book-list" component={BookListPage} />
      </Switch>
    </BrowserRouter>
  );
};
// ========================================

ReactDOM.render(<App />, document.getElementById("root"));

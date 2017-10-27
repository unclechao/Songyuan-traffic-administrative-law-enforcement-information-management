import React, { Component } from "react";
import { Router, Route, Switch } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import LoginPage from "./pages/loginPage";
import Main from "./components/main/main";
import PageNotFound from "./pages/pageNotFound";
import MainFrame from "./pages/mainFrame";

const history = createBrowserHistory();

export default class R extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/login" component={LoginPage} />
            <Route path="/main" component={Main} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

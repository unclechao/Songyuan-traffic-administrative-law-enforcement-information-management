import React, { Component } from "react";
import { Router, Route, Switch } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import LoginPage from "./pages/loginPage";
import PageNotFound from "./pages/pageNotFound";
import MainFrame from "./pages/mainFrame";
import AdminOrganInfoPage from "./pages/basicInfo/adminOrganInfoPage";
import AdminVehInfoPage from "./pages/basicInfo/adminVehInfoPage";
import AdminPeopleInfoPage from "./pages/basicInfo/adminPeopleInfoPage";

const history = createBrowserHistory();

export default class R extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={MainFrame} />
            <Route path="/login" component={LoginPage} />
            <Route path="/main" component={MainFrame} />
            <Route path="/adminOrganInfo:keyId" component={AdminOrganInfoPage} />
            <Route path="/adminVehInfo:keyId" component={AdminVehInfoPage} />
            <Route path="/adminPeopleInfo:keyId" component={AdminPeopleInfoPage} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

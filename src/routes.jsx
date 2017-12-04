import React, { Component } from "react";
import { Router, Route, Switch } from "react-router";
import createBrowserHistory from "history/createBrowserHistory";
import LoginPage from "./pages/loginPage";
import PageNotFound from "./pages/pageNotFound";
import MainFrame from "./pages/mainFrame";
import AdminOrganInfoPage from "./pages/basicInfo/adminOrganInfoPage";
import AdminVehInfoPage from "./pages/basicInfo/adminVehInfoPage";
import AdminPeopleInfoPage from "./pages/basicInfo/adminPeopleInfoPage";
import AdminEquipmentInfoPage from "./pages/basicInfo/adminEquipmentInfoPage";
import EnforcementInspectionPage from "./pages/enforcementAttendance/enforcementInspectionPage";
import AttendanceInfoPage from "./pages/enforcementAttendance/attendanceInfoPage";
import MonitorPage from "./pages/vehicleMonitor/monitorPage";
import TracePage from "./pages/vehicleMonitor/tracePage";
import MessageDispatchPage from "./pages/peopleDispatch/messageDispatchPage";
import TextMessageDispatchPage from "./pages/vehicleDispatch/textMessageDispatchPage";
import OrderCreatePage from "./pages/workOrder/orderCreatePage";
import OrderDealPage from "./pages/workOrder/orderDealPage";
import OrderSearchPage from "./pages/workOrder/orderSearchPage";
import DispatchOptionPage from "./pages/vehicleDispatch/dispatchOptionPage";

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
            <Route
              path="/adminOrganInfo:keyId"
              component={AdminOrganInfoPage}
            />
            <Route path="/adminVehInfo:keyId" component={AdminVehInfoPage} />
            <Route
              path="/adminPeopleInfo:keyId"
              component={AdminPeopleInfoPage}
            />
            <Route
              path="/adminEquipmentInfo:keyId"
              component={AdminEquipmentInfoPage}
            />
            <Route
              path="/enforcementInspectionPage:keyId"
              component={EnforcementInspectionPage}
            />
            <Route
              path="/attendanceInfoPage:keyId"
              component={AttendanceInfoPage}
            />
            <Route path="/monitor:keyId" component={MonitorPage} />
            <Route path="/trace:keyId" component={TracePage} />
            <Route
              path="/messageDispatch:keyId"
              component={MessageDispatchPage}
            />
            <Route
              path="/textMessageDispatch:keyId"
              component={TextMessageDispatchPage}
            />
            <Route path="/workOrderCreate:keyId" component={OrderCreatePage} />
            <Route path="/workOrderDeal:keyId" component={OrderDealPage} />
            <Route path="/workOrderSearch:keyId" component={OrderSearchPage} />
            <Route
              path="/dispatchOption:keyId"
              component={DispatchOptionPage}
            />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

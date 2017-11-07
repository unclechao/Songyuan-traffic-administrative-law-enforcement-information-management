import React, { Component } from "react";
import Main from "../../components/system/main/main";
import EnforcementInspectionTable from "../../components/enforcementAttendance/enforcementInspection/enforcementInspectionTable";

export default class EnforcementInspectionPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>
          <EnforcementInspectionTable />
        </Main>
      </div>
    );
  }
}

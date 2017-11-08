import React, { Component } from "react";
import Main from "../../components/system/main/main";
import AttendanceInfoTable from "../../components/enforcementAttendance/attendanceInfo/attendanceInfoTable";

export default class AttendanceInfoPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>
          <AttendanceInfoTable />
        </Main>
      </div>
    );
  }
}

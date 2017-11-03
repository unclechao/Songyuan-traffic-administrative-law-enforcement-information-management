import React, { Component } from "react";
import Main from "../components/main/main";
import AdminVehInfoTable from "../components/basicInfo/adminVehInfo/adminVehInfoTable";

export default class AdminVehInfoPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>
          <AdminVehInfoTable />
        </Main>
      </div>
    );
  }
}

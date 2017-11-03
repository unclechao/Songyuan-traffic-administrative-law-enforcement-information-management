import React, { Component } from "react";
import Main from "../../components/system/main/main";
import AdminOrganInfoTable from "../../components/basicInfo/adminOrganInfo/adminOrganInfoTable";

export default class AdminOrganInfoPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>
          <AdminOrganInfoTable />
        </Main>
      </div>
    );
  }
}

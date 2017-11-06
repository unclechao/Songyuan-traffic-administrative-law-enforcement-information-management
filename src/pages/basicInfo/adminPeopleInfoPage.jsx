import React, { Component } from "react";
import Main from "../../components/system/main/main";
import AdminPeopleInfoTable from "../../components/basicInfo/adminPeopleInfo/adminPeopleTable";

export default class AdminPeopleInfoPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>
          <AdminPeopleInfoTable />
        </Main>
      </div>
    );
  }
}

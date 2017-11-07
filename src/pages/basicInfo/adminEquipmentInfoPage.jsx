import React, { Component } from "react";
import Main from "../../components/system/main/main";
import AdminEquipmentInfoTable from "../../components/basicInfo/adminEquipmentInfo/adminEquipmentTable";

export default class AdminEquipmentInfoPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>
          <AdminEquipmentInfoTable />
        </Main>
      </div>
    );
  }
}

import React, { Component } from "react";
import Main from "../components/main/main";

import AntdTable from "../components/antdTable/antdTable";

export default class AdminVehInfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      child: AntdTable
    };
  }

  render() {
    return (
      <div>
        <Main {...this.props}>
          <AntdTable />
        </Main>
      </div>
    );
  }
}

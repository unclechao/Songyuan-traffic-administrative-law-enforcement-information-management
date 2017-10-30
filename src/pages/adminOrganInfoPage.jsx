import React, { Component } from "react";
import Main from "../components/main/main";

export default class AdminOrganInfoPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props} children="这里是执法人员子页面" />
      </div>
    );
  }
}

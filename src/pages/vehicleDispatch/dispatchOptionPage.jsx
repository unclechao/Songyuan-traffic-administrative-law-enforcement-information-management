import React, { Component } from "react";
import Main from "../../components/system/main/main";

export default class dispatchOptionPage extends Component {
  render() {
    return (
      <div>
        <Main {...this.props}>参数设置</Main>
      </div>
    );
  }
}

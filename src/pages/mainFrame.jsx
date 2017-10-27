import React, { Component } from "react";
import Main from "../components/main/main";

export default class MainFrame extends Component {
  render() {
    return (
      <div>
        <Main {...this.props} />
      </div>
    );
  }
}

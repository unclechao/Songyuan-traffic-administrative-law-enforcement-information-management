import React, { Component } from "react";
import Main from "../components/main/main";

export default class MainFrame extends Component {
  constructor(props) {
    super(props);
    //console.log(this.props)
  }
  render() {
    return (
      <div>
        <Main fatherProps={this.props} />
      </div>
    );
  }
}

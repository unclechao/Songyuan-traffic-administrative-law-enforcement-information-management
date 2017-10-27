import React, { Component } from "react";
import Header from "../components/header/header";
import Login from "../components/login/login";
import Footer from "../components/footer/footer";

export default class LoginPage extends Component {
  render() {
    return (
      <div>
        <Header {...this.props} title="松原交通综合行政执法信息管理系统" />
        <Login {...this.props} />
        <Footer />
      </div>
    );
  }
}

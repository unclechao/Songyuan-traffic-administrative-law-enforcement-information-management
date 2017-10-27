import React from "react";
import AuthComponent from "../authComponent/authComponent";
import AntdMenu from "../antdMenu/antdMenu";
import AntdTable from "../antdTable/antdTable";
import Header from "../header/header";
import Footer from "../footer/footer";

export default class Main extends AuthComponent {
  render() {
    return (
      <div>
        <Header title="松原交通综合行政执法信息管理系统" fatherProps={this.props} />
        <AntdMenu />
        <AntdTable />
        <Footer />
      </div>
    );
  }
}

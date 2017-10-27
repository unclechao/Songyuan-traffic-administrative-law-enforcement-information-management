import React from "react";
import { Layout } from "antd";
import AuthComponent from "../authComponent/authComponent";
import AntdMenu from "../antdMenu/antdMenu";
import AntdTable from "../antdTable/antdTable";
import Header from "../header/header";
import Footer from "../footer/footer";

export default class Main extends AuthComponent {
  render() {
    return (
      <Layout>
        <Header title="松原交通综合行政执法信息管理系统" fatherProps={this.props} />
        <Layout style={{ margin: "30px 0 0 0", background: "#fff" }}>
          <Layout.Sider
            width="240"
            style={{ margin: "30px 4px 4px 0", background: "#fff" }}
          >
            <AntdMenu />
          </Layout.Sider>
          <Layout.Content style={{ margin: "30px 4px 4px 4px" }}>
            <AntdTable />
            <AntdTable />
          </Layout.Content>
        </Layout>
        <Footer />
      </Layout>
    );
  }
}

import React, { Component } from "react";
import "antd/dist/antd.css";
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;

export default class AntdMenu extends Component {
    handleMenuClick = e => {
    console.log("click ", e);
  };

  render() {
    return (
      <Menu
        onClick={this.handleMenuClick}
        style={{ width: 240 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="appstore" />
              <span>功能1</span>
            </span>
          }
        >
          <Menu.Item key="5">Option 1</Menu.Item>
          <Menu.Item key="6">Option 2</Menu.Item>
          <SubMenu key="sub3" title="子功能1">
            <Menu.Item key="7">Option 3</Menu.Item>
            <Menu.Item key="8">Option 4</Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    );
  }
}

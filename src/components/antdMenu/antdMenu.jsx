import React, { Component } from "react";
import "antd/dist/antd.css";
import { Menu, Icon } from "antd";

export default class AntdMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: [],
      rootSubmenuKeys: [
        "sub1",
        "sub2",
        "sub3",
        "sub4",
        "sub5",
        "sub6",
        "sub7",
        "sub8"
      ]
    };
  }

  handleMenuClick = e => {
    console.log("click ", e);
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  render() {
    return (
      <Menu
        onClick={this.handleMenuClick}
        style={{ width: 240 }}
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        mode="inline"
      >
        <Menu.SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="appstore" />
              <span>基础信息管理</span>
            </span>
          }
        >
          <Menu.Item key="11">执法机构档案</Menu.Item>
          <Menu.Item key="12">执法人员档案</Menu.Item>
          <Menu.Item key="13">执法车辆档案</Menu.Item>
          <Menu.Item key="14">执法装备档案</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="appstore" />
              <span>外勤信息管理</span>
            </span>
          }
        >
          <Menu.Item key="21">出勤信息</Menu.Item>
          <Menu.Item key="22">执法检查</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub3"
          title={
            <span>
              <Icon type="appstore" />
              <span>车辆运行监控</span>
            </span>
          }
        >
          <Menu.Item key="31">实时监控</Menu.Item>
          <Menu.Item key="32">运行轨迹</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub4"
          title={
            <span>
              <Icon type="appstore" />
              <span>车辆调度</span>
            </span>
          }
        >
          <Menu.Item key="41">文本调度信息</Menu.Item>
          <Menu.Item key="42">参数设置</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub5"
          title={
            <span>
              <Icon type="appstore" />
              <span>人员监控调度</span>
            </span>
          }
        >
          <Menu.Item key="51">语音调度</Menu.Item>
          <Menu.Item key="52">短信调度</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub6"
          title={
            <span>
              <Icon type="appstore" />
              <span>投诉办理</span>
            </span>
          }
        >
          <Menu.Item key="61">工单创建</Menu.Item>
          <Menu.Item key="62">工单处理</Menu.Item>
          <Menu.Item key="63">工单查询</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub7"
          title={
            <span>
              <Icon type="appstore" />
              <span>报表统计</span>
            </span>
          }
        >
          <Menu.Item key="71">执法人员外勤统计</Menu.Item>
          <Menu.Item key="72">行政处罚统计</Menu.Item>
          <Menu.Item key="73">执法车辆里程统计</Menu.Item>
          <Menu.Item key="74">投诉处理统计</Menu.Item>
          <Menu.Item key="75">监督检查统计</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub8"
          title={
            <span>
              <Icon type="appstore" />
              <span>系统设置</span>
            </span>
          }
        >
          <Menu.Item key="81">用户设置</Menu.Item>
          <Menu.Item key="82">关于</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  }
}

import React, { Component } from "react";
import "antd/dist/antd.min.css";
import { Menu, Icon } from "antd";

export default class AntdMenu extends Component {
  constructor(props) {
    super(props);
    let keyId = [];
    if (this.props.match.params.keyId) {
      keyId = [this.props.match.params.keyId.split(":")[1]];
    }
    let selectedKey = [this.props.location.pathname.split("/")[1]];
    this.state = {
      openKeys: keyId,
      defaultSelectedKeys: selectedKey,
      rootSubmenuKeys: ["1", "2", "3", "4", "5", "6", "7", "8"]
    };
  }

  handleMenuClick = e => {
    this.props.history.push(e.key);
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
        defaultOpenKeys={this.state.openKeys}
        defaultSelectedKeys={this.state.defaultSelectedKeys}
        onOpenChange={this.onOpenChange}
        mode="inline"
      >
        <Menu.SubMenu
          key="1"
          title={
            <span>
              <Icon type="appstore" />
              <span>基础信息管理</span>
            </span>
          }
        >
          <Menu.Item key="adminOrganInfo:1">执法机构档案</Menu.Item>
          <Menu.Item key="adminPeopleInfo:1">执法人员档案</Menu.Item>
          <Menu.Item key="adminVehInfo:1">执法车辆档案</Menu.Item>
          <Menu.Item key="adminEquipmentInfo:1">执法装备档案</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="2"
          title={
            <span>
              <Icon type="appstore" />
              <span>外勤信息管理</span>
            </span>
          }
        >
          <Menu.Item key="attendanceInfoPage:2">出勤信息</Menu.Item>
          <Menu.Item key="enforcementInspectionPage:2">执法检查</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="3"
          title={
            <span>
              <Icon type="appstore" />
              <span>车辆运行监控</span>
            </span>
          }
        >
          <Menu.Item key="monitor:3">实时监控</Menu.Item>
          <Menu.Item key="trace:3">运行轨迹</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="4"
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
          key="5"
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
          key="6"
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
          key="7"
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
          key="8"
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

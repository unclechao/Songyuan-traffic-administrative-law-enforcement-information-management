import React, { Component } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";
import iziToast from "iziToast";
import "izitoast/dist/css/iziToast.min.css";

const columns = [
  {
    title: "车架号",
    dataIndex: "simNo",
    sorter: true
  },
  {
    title: "车牌号",
    dataIndex: "vehNo",
    sorter: true
  },
  {
    title: "品牌类型",
    dataIndex: "vehType",
    filters: [
      { text: "大众", value: "大众" },
      { text: "捷达", value: "捷达" },
      { text: "丰田", value: "丰田" }
    ]
  }
];

export default class AntdTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };
  fetch = (params = {}) => {
    this.setState({ loading: true });

    fetch("/api/getAdminVehInfoData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: window.localStorage.token,
        params
      })
    })
      .then(res => {
        res.json().then(ret => {
          const pagination = { ...this.state.pagination };
          pagination.total = ret.totalCount;
          this.setState({
            loading: false,
            data: ret.data,
            pagination
          });
        });
      })
      .catch(err => {
        iziToast.error({
          title: "错误",
          message: "系统异常,请联系管理员",
          transitionIn: "bounceInLeft",
          transitionOut: "fadeOutRight"
        });
      });
  };
  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record.key}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

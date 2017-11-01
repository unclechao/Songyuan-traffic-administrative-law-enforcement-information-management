import React, { Component } from "react";
import { Table, Button, Popconfirm } from "antd";
import "antd/dist/antd.min.css";
import "./antdTable.css";
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
  },
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 100,
    render: () => <Button>修改</Button>
  }
];

export default class AntdTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedRowKeys: [],
      pagination: {},
      loading: false,
      disableDel: true
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

  handleConfirmDel(e) {
    e.preventDefault();
    fetch("/api/deleteAdminInfoData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: window.localStorage.token,
        params: this.state.selectedRowKeys
      })
    })
      .then(res => {
        res.json().then(ret => {
          if (ret.code === 0) {
            iziToast.error({
              title: "错误",
              message: "系统异常,请联系管理员",
              transitionIn: "bounceInLeft",
              transitionOut: "fadeOutRight"
            });
          } else {
            this.fetch();
          }
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
  }

  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRowKeys.length > 0) {
          this.setState({ disableDel: false, selectedRowKeys });
        } else {
          this.setState({ disableDel: true, selectedRowKeys });
        }
      }
    };

    return (
      <div>
        <div className="table-operations">
          <Button>新增</Button>
          <Popconfirm
            title="确定删除选中条目?"
            onConfirm={this.handleConfirmDel.bind(this)}
            okText="是的,确定"
            cancelText="不,我再想想"
          >
            <Button disabled={this.state.disableDel}>删除</Button>
          </Popconfirm>
        </div>
        <Table
          columns={columns}
          rowSelection={rowSelection}
          rowKey={record => record._id}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

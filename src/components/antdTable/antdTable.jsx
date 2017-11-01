import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  notification,
  message
} from "antd";
import "antd/dist/antd.min.css";
import "./antdTable.css";

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
      disableDel: true,
      addModalVisible: false,
      modalConfirmLoading: false,
      addSelectValue: ""
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
        notification["error"]({
          placement: "bottomRight",
          message: "错误",
          description: "系统异常,请联系管理员"
        });
      });
  };
  componentDidMount() {
    this.fetch();
  }

  showAddModal() {
    this.setState({ addModalVisible: true });
  }

  handleModalCancel() {
    this.setState({ addModalVisible: false });
  }

  handleModalOk() {
    this.setState({ modalConfirmLoading: true });
    // 模拟post执行
    // 获取信息
    const simInput = ReactDOM.findDOMNode(this.refs.simInput).value.trim();
    const noInput = ReactDOM.findDOMNode(this.refs.noInput).value.trim();
    console.log(`${simInput},${noInput}`);
    console.log(this.state.addSelectValue);

    if (simInput === "" || noInput === "" || this.state.addSelectValue === "") {
      this.setState({
        modalConfirmLoading: false
      });
    } else {
      setTimeout(() => {
        this.setState({
          addModalVisible: false,
          modalConfirmLoading: false
        });
      }, 2000);
    }
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
            notification["error"]({
              placement: "bottomRight",
              message: "错误",
              description: "系统异常,请联系管理员"
            });
          } else {
            this.fetch();
          }
        });
      })
      .catch(err => {
        notification["error"]({
          placement: "bottomRight",
          message: "错误",
          description: "系统异常,请联系管理员"
        });
      });
  }

  handleSelectChange(addSelectValue) {
    this.setState({ addSelectValue });
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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    return (
      <div>
        <div className="table-operations">
          <Button onClick={this.showAddModal.bind(this)}>新增</Button>
          <Modal
            title="添加执法车辆"
            visible={this.state.addModalVisible}
            onOk={this.handleModalOk.bind(this)}
            onCancel={this.handleModalCancel.bind(this)}
            confirmLoading={this.state.modalConfirmLoading}
          >
            <Form>
              <Form.Item {...formItemLayout} label="车架号:">
                <Input placeholder="请输入车架号" ref="simInput" id="simInput" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="车牌号:">
                <Input placeholder="请输入车牌号" ref="noInput" id="noInput" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="品牌类型:">
                <Select
                  onChange={this.handleSelectChange.bind(this)}
                  defaultValue="请选择品牌类型..."
                >
                  <Select.Option value="大众">大众</Select.Option>
                  <Select.Option value="捷达">捷达</Select.Option>
                  <Select.Option value="丰田">丰田</Select.Option>
                </Select>
              </Form.Item>
            </Form>
            <div id="alertInfo" />
          </Modal>
          <Popconfirm
            title="确定删除选中条目?"
            onConfirm={this.handleConfirmDel.bind(this)}
            okText="是的,确定"
            cancelText="不,我再想想"
            okType="danger"
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

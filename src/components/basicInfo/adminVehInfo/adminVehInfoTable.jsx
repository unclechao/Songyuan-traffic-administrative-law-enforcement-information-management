import React, { Component } from "react";
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
import "./adminVehInfoTable.css";

message.config({
  top: 60
});

export default class AdminVehInfoTable extends Component {
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
      addSelectValue: "请选择品牌类型...",
      editRecord: {},
      simInput: "",
      noInput: "",
      editId: ""
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
          if (ret.code === -1) {
            notification["error"]({
              placement: "bottomRight",
              message: "错误",
              description: "系统异常,请联系管理员"
            });
          } else if (ret.code !== 0) {
            message.warning(ret.message);
          } else {
            const pagination = { ...this.state.pagination };
            pagination.total = ret.totalCount;
            this.setState({
              loading: false,
              data: ret.data,
              pagination
            });
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
  };

  componentDidMount() {
    this.fetch();
  }

  simInputChange(e) {
    this.setState({ simInput: e.target.value });
  }

  noInputChange(e) {
    this.setState({ noInput: e.target.value });
  }

  showModal(type) {
    if (type === "edit") {
      this.setState((prevState, props) => ({
        simInput: prevState.editRecord.simNo,
        noInput: prevState.editRecord.vehNo,
        addSelectValue: prevState.editRecord.vehType,
        editId: prevState.editRecord._id
      }));
    } else {
      this.setState({ editId: "" });
    }
    this.setState({ addModalVisible: true });
  }

  handleModalCancel() {
    this.setState({ addModalVisible: false });
  }

  handleModalOk() {
    this.setState({ modalConfirmLoading: true });
    const simInput = this.state.simInput;
    const noInput = this.state.noInput;

    if (
      simInput === "" ||
      noInput === "" ||
      this.state.addSelectValue === "请选择品牌类型..."
    ) {
      message.warning("请将信息填写完整");
      this.setState({
        modalConfirmLoading: false
      });
    } else {
      fetch("/api/addAdminVehInfoData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          params: {
            editId: this.state.editId,
            simInput,
            noInput,
            addSelectValue: this.state.addSelectValue
          }
        })
      })
        .then(res => {
          res.json().then(ret => {
            this.setState({
              addModalVisible: false,
              modalConfirmLoading: false,
              addSelectValue: "请选择品牌类型...",
              simInput: "",
              noInput: ""
            });
            if (ret.code === -1) {
              notification["error"]({
                placement: "bottomRight",
                message: "错误",
                description: "系统异常,请联系管理员"
              });
            } else if (ret.code !== 0) {
              message.warning(ret.message);
            } else {
              message.success(ret.message);
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
  }

  handleTableRowMouseEnter(record, index, event) {
    this.setState({ editRecord: record });
  }

  handleConfirmDel(e) {
    e.preventDefault();
    fetch("/api/deleteAdminVehInfoData", {
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
          if (ret.code === -1) {
            notification["error"]({
              placement: "bottomRight",
              message: "错误",
              description: "系统异常,请联系管理员"
            });
          } else {
            this.setState({ disableDel: true });
            message.success("删除成功");
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
        title: "所属机构",
        dataIndex: "organ"
      },
      {
        title: "操作",
        key: "operation",
        fixed: "right",
        width: 100,
        render: () => (
          <Button onClick={this.showModal.bind(this, "edit")}>编辑</Button>
        )
      }
    ];

    return (
      <div>
        <div className="table-operations">
          <Button onClick={this.showModal.bind(this, "add")}>新增</Button>
          <Modal
            title="执法车辆"
            visible={this.state.addModalVisible}
            onOk={this.handleModalOk.bind(this)}
            onCancel={this.handleModalCancel.bind(this)}
            confirmLoading={this.state.modalConfirmLoading}
          >
            <Form>
              <Form.Item {...formItemLayout} label="车架号:">
                <Input
                  placeholder="请输入车架号"
                  value={this.state.simInput}
                  onChange={this.simInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="车牌号:">
                <Input
                  placeholder="请输入车牌号"
                  value={this.state.noInput}
                  onChange={this.noInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="品牌类型:">
                <Select
                  onChange={this.handleSelectChange.bind(this)}
                  value={this.state.addSelectValue}
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
          onRowMouseEnter={this.handleTableRowMouseEnter.bind(this)}
        />
      </div>
    );
  }
}

import React, { Component } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  notification,
  message
} from "antd";
import "antd/dist/antd.min.css";
import "./adminOrganInfoTable.css";

message.config({
  top: 60
});

export default class AdminOrganInfoTable extends Component {
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
      editRecord: {},
      organNo: "",
      organName: "",
      contactName: "",
      contactPhone: "",
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

    fetch("/api/getAdminOrganInfoData", {
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

  organNameInputChange(e) {
    this.setState({ organName: e.target.value });
  }
  organNoInputChange(e) {
    this.setState({ organNo: e.target.value });
  }
  contactNameInputChange(e) {
    this.setState({ contactName: e.target.value });
  }
  contactPhoneInputChange(e) {
    this.setState({ contactPhone: e.target.value });
  }

  showModal(type) {
    if (type === "edit") {
      this.setState((prevState, props) => ({
        organNo: prevState.editRecord.organNo,
        organName: prevState.editRecord.organName,
        contactName: prevState.editRecord.contactName,
        contactPhone: prevState.editRecord.contactPhone,
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
    const organNo = this.state.organNo;
    const organName = this.state.organName;
    const contactName = this.state.contactName;
    const contactPhone = this.state.contactPhone;

    if (organNo === "" || organName === "") {
      message.warning("请将信息填写完整");
      this.setState({
        modalConfirmLoading: false
      });
    } else {
      fetch("/api/addAdminOrganInfoData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          params: {
            editId: this.state.editId,
            organNo,
            organName,
            contactName,
            contactPhone
          }
        })
      })
        .then(res => {
          res.json().then(ret => {
            this.setState({
              addModalVisible: false,
              modalConfirmLoading: false,
              organNo: "",
              organName: "",
              contactName: "",
              contactPhone: ""
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
    fetch("/api/deleteAdminOrganInfoData", {
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
        title: "机构编号",
        dataIndex: "organNo",
        sorter: true
      },
      {
        title: "机构名称",
        dataIndex: "organName",
        sorter: true
      },
      {
        title: "机构联系人",
        dataIndex: "contactName"
      },
      {
        title: "联系人电话",
        dataIndex: "contactPhone"
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
            title="执法机构"
            visible={this.state.addModalVisible}
            onOk={this.handleModalOk.bind(this)}
            onCancel={this.handleModalCancel.bind(this)}
            confirmLoading={this.state.modalConfirmLoading}
          >
            <Form>
              <Form.Item {...formItemLayout} label="机构编号:">
                <Input
                  placeholder="请输入机构编号"
                  value={this.state.organNo}
                  onChange={this.organNoInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="机构名称:">
                <Input
                  placeholder="请输入机构名称"
                  value={this.state.organName}
                  onChange={this.organNameInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="机构联系人:">
                <Input
                  value={this.state.contactName}
                  onChange={this.contactNameInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="联系人电话:">
                <Input
                  value={this.state.contactPhone}
                  onChange={this.contactPhoneInputChange.bind(this)}
                />
              </Form.Item>
            </Form>
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

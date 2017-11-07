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
import "./adminEquipmentTable.css";

message.config({
  top: 60
});

export default class AdminEquipmentInfoTable extends Component {
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
      addSexSelectValue: "请选择性别...",
      addOrganSelectValue: "请选择所属机构...",
      editRecord: {},
      phoneInput: "",
      noInput: "",
      nameInput: "",
      editId: "",
      organNameList: []
    };
    // init vehicle organ
    fetch("/api/getAdminOrganInfoNameList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: window.localStorage.token
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
            this.setState({ organNameList: ret.data });
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
    fetch("/api/getAdminPeopleInfoData", {
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

  nameInputChange(e) {
    this.setState({ nameInput: e.target.value });
  }

  noInputChange(e) {
    this.setState({ noInput: e.target.value });
  }

  phoneInputChange(e) {
    this.setState({ phoneInput: e.target.value });
  }

  handleOrganSelectChange(addOrganSelectValue) {
    this.setState({ addOrganSelectValue });
  }

  handleSexSelectChange(addSexSelectValue) {
    this.setState({ addSexSelectValue });
  }

  showModal(type) {
    if (type === "edit") {
      this.setState((prevState, props) => ({
        nameInput: prevState.editRecord.name,
        noInput: prevState.editRecord.no,
        phoneInput: prevState.editRecord.phone,
        addSexSelectValue: prevState.editRecord.sex,
        addOrganSelectValue: prevState.editRecord.organ,
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
    const nameInput = this.state.nameInput;
    const noInput = this.state.noInput;
    const phoneInput = this.state.phoneInput;

    if (
      nameInput === "" ||
      noInput === "" ||
      this.state.addSexSelectValue === "请选择性别..." ||
      this.state.addOrganSelectValue === "请选择所属机构..."
    ) {
      message.warning("请将信息填写完整");
      this.setState({
        modalConfirmLoading: false
      });
    } else {
      fetch("/api/addAdminPeopleInfoData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          params: {
            editId: this.state.editId,
            nameInput,
            noInput,
            phoneInput,
            addSexSelectValue: this.state.addSexSelectValue,
            addOrganSelectValue: this.state.addOrganSelectValue
          }
        })
      })
        .then(res => {
          res.json().then(ret => {
            this.setState(
              {
                addModalVisible: false
              },
              () => {
                this.setState({
                  modalConfirmLoading: false,
                  addSexSelectValue: "请选择性别...",
                  addOrganSelectValue: "请选择所属机构...",
                  nameInput: "",
                  noInput: "",
                  phoneInput: ""
                });
              }
            );
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
    fetch("/api/deleteAdminPeopleInfoData", {
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
    const organNameList = this.state.organNameList;

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
        title: "工号",
        dataIndex: "no",
        sorter: true
      },
      {
        title: "姓名",
        dataIndex: "name",
        sorter: true
      },
      {
        title: "性别",
        dataIndex: "sex",
        filters: [{ text: "男", value: "男" }, { text: "女", value: "女" }]
      },
      {
        title: "电话",
        dataIndex: "phone"
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
            title="执法人员"
            visible={this.state.addModalVisible}
            onOk={this.handleModalOk.bind(this)}
            onCancel={this.handleModalCancel.bind(this)}
            confirmLoading={this.state.modalConfirmLoading}
          >
            <Form>
              <Form.Item {...formItemLayout} label="工号:">
                <Input
                  placeholder="请输入工号"
                  value={this.state.noInput}
                  onChange={this.noInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="姓名:">
                <Input
                  placeholder="请输入姓名"
                  value={this.state.nameInput}
                  onChange={this.nameInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="性别:">
                <Select
                  onChange={this.handleSexSelectChange.bind(this)}
                  value={this.state.addSexSelectValue}
                >
                  <Select.Option value="男">男</Select.Option>
                  <Select.Option value="女">女</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="联系电话:">
                <Input
                  placeholder="请输入联系电话"
                  value={this.state.phoneInput}
                  onChange={this.phoneInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="所属机构:">
                <Select
                  onChange={this.handleOrganSelectChange.bind(this)}
                  value={this.state.addOrganSelectValue}
                >
                  {organNameList.map(d => (
                    <Select.Option key={d._id} value={d.organName}>
                      {d.organName}
                    </Select.Option>
                  ))}
                </Select>
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

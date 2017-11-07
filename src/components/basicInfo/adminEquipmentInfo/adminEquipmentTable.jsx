import React, { Component } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
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
      addOrganSelectValue: "请选择所属机构...",
      editRecord: {},
      countInput: 0,
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
    fetch("/api/getAdminEquipmentInfoData", {
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

  countInputChange(v) {
    if (Number(v)) this.setState({ countInput: v });
  }

  handleOrganSelectChange(addOrganSelectValue) {
    this.setState({ addOrganSelectValue });
  }

  showModal(type) {
    if (type === "edit") {
      this.setState((prevState, props) => ({
        nameInput: prevState.editRecord.equipmentName,
        noInput: prevState.editRecord.equipmentNo,
        countInput: prevState.editRecord.count,
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
    const countInput = this.state.countInput;

    if (
      nameInput === "" ||
      noInput === "" ||
      this.state.addOrganSelectValue === "请选择所属机构..."
    ) {
      message.warning("请将信息填写完整");
      this.setState({
        modalConfirmLoading: false
      });
    } else {
      fetch("/api/addAdminEquipmentInfoData", {
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
            countInput,
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
                  addOrganSelectValue: "请选择所属机构...",
                  nameInput: "",
                  noInput: "",
                  countInput: ""
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
    fetch("/api/deleteAdminEquipmentInfoData", {
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
        title: "装备编号",
        dataIndex: "equipmentNo",
        sorter: true
      },
      {
        title: "装备名称",
        dataIndex: "equipmentName",
        sorter: true
      },
      {
        title: "装备数量",
        dataIndex: "count",
        sorter: true
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
            title="执法装备"
            visible={this.state.addModalVisible}
            onOk={this.handleModalOk.bind(this)}
            onCancel={this.handleModalCancel.bind(this)}
            confirmLoading={this.state.modalConfirmLoading}
          >
            <Form>
              <Form.Item {...formItemLayout} label="装备编号:">
                <Input
                  placeholder="请输入装备编号"
                  value={this.state.noInput}
                  onChange={this.noInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="装备名称:">
                <Input
                  placeholder="请输入装备名称"
                  value={this.state.nameInput}
                  onChange={this.nameInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="数量:">
                <InputNumber
                  min={0}
                  defaultValue={0}
                  value={this.state.countInput}
                  onChange={this.countInputChange.bind(this)}
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

import React, { Component } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
  message
} from "antd";
import moment from "moment";
import "antd/dist/antd.min.css";
import "../../../styles/antdTable.css";

message.config({
  top: 60
});

export default class EnforcementInspectionTable extends Component {
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
      recordInput: "",
      dateInput: null,
      locationInput: "",
      checkObject: "",
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
    fetch("/api/getEnforcementInspectionData", {
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

  locationInputChange(e) {
    this.setState({ locationInput: e.target.value });
  }

  dateInputChange(date, dateString) {
    this.setState({ dateInput: date });
  }

  recordInputInputChange(e) {
    this.setState({ recordInput: e.target.value });
  }

  checkObjectInputChange(e) {
    this.setState({ checkObject: e.target.value });
  }

  handleOrganSelectChange(addOrganSelectValue) {
    this.setState({ addOrganSelectValue });
  }

  showModal(type) {
    if (type === "edit") {
      this.setState((prevState, props) => ({
        locationInput: prevState.editRecord.location,
        dateInput: moment(prevState.editRecord.inspectionTime),
        recordInput: prevState.editRecord.remark,
        addOrganSelectValue: prevState.editRecord.organ,
        checkObject: prevState.editRecord.checkObject,
        editId: prevState.editRecord._id
      }));
    } else {
      this.setState({
        editId: "",
        addOrganSelectValue: "请选择所属机构...",
        dateInput: null,
        locationInput: "",
        checkObject: "",
        recordInput: ""
      });
    }
    this.setState({ addModalVisible: true });
  }

  handleModalCancel() {
    this.setState({ addModalVisible: false });
  }

  handleModalOk() {
    this.setState({ modalConfirmLoading: true });
    const dateInput = this.state.dateInput;
    const locationInput = this.state.locationInput;
    const recordInput = this.state.recordInput;
    const checkObject = this.state.checkObject;
    if (
      dateInput === null ||
      locationInput === "" ||
      checkObject === "" ||
      this.state.addOrganSelectValue === "请选择所属机构..."
    ) {
      message.warning("请将信息填写完整");
      this.setState({
        modalConfirmLoading: false
      });
    } else {
      fetch("/api/addEnforcementInspectionData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          params: {
            editId: this.state.editId,
            dateInput,
            locationInput,
            checkObject,
            recordInput,
            addOrganSelectValue: this.state.addOrganSelectValue
          }
        })
      })
        .then(res => {
          res.json().then(ret => {
            this.setState({
              addModalVisible: false,
              modalConfirmLoading: false
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
    fetch("/api/deleteEnforcementInspectionData", {
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
        title: "检查时间",
        dataIndex: "inspectionTime",
        sorter: true,
        render: (text, record, index) => {
          return moment(text).format("YYYY/MM/DD");
        }
      },
      {
        title: "地点",
        dataIndex: "location",
        sorter: true
      },
      {
        title: "检查对象",
        dataIndex: "checkObject",
        sorter: true
      },
      {
        title: "检查机构",
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
            title="执法检查"
            visible={this.state.addModalVisible}
            onOk={this.handleModalOk.bind(this)}
            onCancel={this.handleModalCancel.bind(this)}
            confirmLoading={this.state.modalConfirmLoading}
          >
            <Form>
              <Form.Item {...formItemLayout} label="检查时间:">
                <DatePicker
                  style={{ width: "285px" }}
                  value={this.state.dateInput}
                  onChange={this.dateInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="地点:">
                <Input
                  placeholder="请输入执法检查地点"
                  value={this.state.locationInput}
                  onChange={this.locationInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="检查对象:">
                <Input
                  placeholder="请输入检查对象"
                  value={this.state.checkObject}
                  onChange={this.checkObjectInputChange.bind(this)}
                />
              </Form.Item>
              <Form.Item {...formItemLayout} label="检查机构:">
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
              <Form.Item {...formItemLayout} label="记录:">
                <Input.TextArea
                  placeholder="请输入检查记录"
                  value={this.state.recordInput}
                  onChange={this.recordInputInputChange.bind(this)}
                  autosize={{ minRows: 2, maxRows: 6 }}
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

import React, { Component } from "react";
import moment from "moment";
import Main from "../../components/system/main/main";
import {
  Button,
  Form,
  Input,
  Radio,
  DatePicker,
  notification,
  message
} from "antd";

export default class OrderCreatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      describeInput: "",
      importantLevel: "一般",
      no: new Date().getTime()
    };
  }

  describeInputChange = e => {
    this.setState({ describeInput: e.target.value });
  };
  onLevelChange = e => {
    this.setState({ importantLevel: e.target.value });
  };
  submitOrder = () => {
    if (this.state.describeInput === "") {
      message.warning("请将信息填写完整");
    } else {
      fetch("/api/addWorkOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: window.localStorage.token,
          params: {
            no: this.state.no,
            importantLevel: this.state.importantLevel,
            describe: this.state.describeInput,
            time: moment()
          }
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
              this.setState({
                no: new Date().getTime(),
                describeInput:""
              });
              message.success(ret.message);
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
  };

  render() {
    return (
      <div>
        <Main {...this.props}>
          <Form>
            <Form.Item label="工单编号:">
              <Input
                disabled
                value={this.state.no}
                style={{ width: "400px" }}
              />
            </Form.Item>
            <Form.Item label="创建时间:">
              <DatePicker
                style={{ width: "400px" }}
                disabled
                defaultValue={moment()}
              />
            </Form.Item>
            <Form.Item label="优先级:">
              <Radio.Group
                onChange={this.onLevelChange}
                value={this.state.importantLevel}
              >
                <Radio value={"一般"}>一般</Radio>
                <Radio value={"重要"}>重要</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="问题描述:">
              <Input.TextArea
                style={{ width: "400px" }}
                value={this.state.describeInput}
                onChange={this.describeInputChange.bind(this)}
                autosize={{ minRows: 6, maxRows: 10 }}
              />
            </Form.Item>
            <Form.Item>
              <Button onClick={this.submitOrder.bind(this)}>提交</Button>
            </Form.Item>
          </Form>
        </Main>
      </div>
    );
  }
}

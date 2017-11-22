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
      recordInput: "",
      importantLevel: "一般",
      no: new Date().getTime()
    };
  }

  recordInputInputChange = e => {
    this.setState({ recordInput: e.target.value });
  };
  onLevelChange = e => {
    this.setState({ importantLevel: e.target.value });
  };
  submitOrder = () => {
    console.log(this.state.no);
    console.log(this.state.importantLevel);
    console.log(this.state.recordInput);
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
                value={this.state.recordInput}
                onChange={this.recordInputInputChange.bind(this)}
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

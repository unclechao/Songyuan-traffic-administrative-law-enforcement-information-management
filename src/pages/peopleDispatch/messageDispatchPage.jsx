import React, { Component } from "react";
import { Button, Row, Col, Tree, Input, notification, message } from "antd";
import Main from "../../components/system/main/main";

export default class MessageDispatchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      treeData: [],
      sendContent: "",
      rewriteBtnDisable: true,
      sendBtnDisable: true
    };

    fetch("/api/getOrganAndPeopleTreeList", {
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
            this.setState({ treeData: ret.data });
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

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };
  onCheck = checkedKeys => {
    if (checkedKeys.length > 0 && this.state.rewriteBtnDisable === false) {
      this.setState({ sendBtnDisable: false, checkedKeys });
    } else {
      this.setState({ sendBtnDisable: true, checkedKeys });
    }
  };

  onClear = () => {
    this.setState({ sendContent: "", rewriteBtnDisable: true }, () => {
      if (
        this.state.checkedKeys.length > 0 &&
        this.state.rewriteBtnDisable === false
      ) {
        this.setState({
          sendBtnDisable: false,
          sendContent: "",
          rewriteBtnDisable: true
        });
      } else {
        this.setState({
          sendBtnDisable: true,
          sendContent: "",
          rewriteBtnDisable: true
        });
      }
    });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ sendContent: e.target.value }, () => {
      if (this.state.sendContent !== "") {
        this.setState({ rewriteBtnDisable: false }, () => {
          if (
            this.state.checkedKeys.length > 0 &&
            this.state.rewriteBtnDisable === false
          ) {
            this.setState({ sendBtnDisable: false });
          } else {
            this.setState({ sendBtnDisable: true });
          }
        });
      } else {
        this.setState({ rewriteBtnDisable: true }, () => {
          if (
            this.state.checkedKeys.length > 0 &&
            this.state.rewriteBtnDisable === false
          ) {
            this.setState({ sendBtnDisable: false });
          } else {
            this.setState({ sendBtnDisable: true });
          }
        });
      }
    });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} />;
    });
  };

  render() {
    return (
      <div>
        <Main {...this.props}>
          <Row>
            <Col span={6}>
              <p>请选择短信发送对象:</p>
              <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </Col>
            <Col span={18}>
              <Row>
                <div style={{ margin: "0 10px 0 0" }}>
                  <p>请填写短信发送内容:</p>
                  <Input.TextArea
                    placeholder="内容"
                    autosize={{ minRows: 10, maxRows: 20 }}
                    value={this.state.sendContent}
                    onChange={this.handleChange.bind(this)}
                    ref="sengContentInput"
                  />
                </div>
              </Row>
              <Row type="flex" justify="end">
                <Col>
                  <Button
                    style={{ margin: "10px" }}
                    onClick={this.onClear.bind(this)}
                    disabled={this.state.rewriteBtnDisable}
                  >
                    重新填写
                  </Button>
                  <Button
                    style={{ margin: "10px" }}
                    disabled={this.state.sendBtnDisable}
                  >
                    发送
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Main>
      </div>
    );
  }
}

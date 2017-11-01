import { Component } from "react";
import { notification } from "antd";

export default class AuthComponent extends Component {
  constructor(props) {
    super(props);
    // 鉴权,失败时跳转到登录页面
    fetch("/api/authValidate", {
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
          if (ret.code === 0) {
            notification["error"]({
              placement: "bottomRight",
              message: "错误",
              description: "系统异常,请联系管理员"
            });
          } else {
            if (ret.validate === false) {
              notification["warning"]({
                placement: "bottomRight",
                message: "提示",
                description: "ret.message"
              });
              this.props.history.push("/login");
            }
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
    return null;
  }
}

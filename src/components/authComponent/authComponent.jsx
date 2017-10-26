import { Component } from "react";
import iziToast from "iziToast";
import "izitoast/dist/css/iziToast.min.css";

export default class AuthComponent extends Component {
  constructor(props) {
    super(props);
    // 鉴权,失败时跳转到登录页面
    var storage = window.localStorage;

    fetch("/api/authValidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: storage.token
      })
    })
      .then(res => {
        res.json().then(ret => {
          if (ret.code === 0) {
            iziToast.error({
              title: "错误",
              message: "系统异常,请联系管理员",
              transitionIn: "bounceInLeft",
              transitionOut: "fadeOutRight"
            });
          } else {
            if (ret.validate === false) {
              iziToast.info({
                title: "提示",
                message: ret.message,
                transitionIn: "bounceInLeft",
                transitionOut: "fadeOutRight"
              });
              props.history.push("/login");
            }
          }
        });
      })
      .catch(err => {
        iziToast.error({
          title: "错误",
          message: "系统异常,请联系管理员",
          transitionIn: "bounceInLeft",
          transitionOut: "fadeOutRight"
        });
      });
  }

  render() {
    return null;
  }
}

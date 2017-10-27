import React, { Component } from "react";
import ReactDOM from "react-dom";
import jsSHA from "jssha";
import iziToast from "iziToast";
import "izitoast/dist/css/iziToast.min.css";
import "./login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginBtnDisable: true,
      passwordInputType: "password",
      checkboxClass: "checkbox"
    };
  }

  handleChange(e) {
    e.preventDefault();
    const usernameInput = ReactDOM.findDOMNode(
      this.refs.usernameInput
    ).value.trim();
    const passwordInput = ReactDOM.findDOMNode(
      this.refs.passwordInput
    ).value.trim();
    if (usernameInput !== "" && passwordInput !== "") {
      this.setState((prevState, props) => {
        return { loginBtnDisable: false };
      });
    } else {
      this.setState((prevState, props) => {
        return { loginBtnDisable: true };
      });
    }
  }

  loginHandle(e) {
    e.preventDefault();
    const usernameInput = ReactDOM.findDOMNode(
      this.refs.usernameInput
    ).value.trim();
    const passwordInput = ReactDOM.findDOMNode(
      this.refs.passwordInput
    ).value.trim();

    if (usernameInput === "" || passwordInput === "") {
      iziToast.warning({
        title: "提示",
        message: "用户名或密码不能为空",
        transitionIn: "bounceInLeft",
        transitionOut: "fadeOutRight"
      });
    } else {
      this.setState((prevState, props) => {
        return { loginBtnDisable: true };
      });

      //hash password
      var shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.update(passwordInput);
      var hashPassword = shaObj.getHash("HEX");

      fetch("/api/authorizeLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usernameInput,
          hashPassword: hashPassword
        })
      })
        .then(res => {
          this.setState((prevState, props) => {
            return { loginBtnDisable: false };
          });
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
                  title: "失败",
                  message: ret.message,
                  transitionIn: "bounceInLeft",
                  transitionOut: "fadeOutRight"
                });
              } else {
                var storage = window.localStorage;
                storage["uid"] = ret.uid;
                storage["username"] = ret.username;
                storage["token"] = ret.token;
                iziToast.success({
                  title: "成功",
                  message: ret.message,
                  transitionIn: "bounceInLeft",
                  transitionOut: "fadeOutRight"
                });
                this.props.fatherProps.history.push("/main");
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
  }

  handleShowPassword(e) {
    if (this.state.passwordInputType === "password") {
      this.setState({
        passwordInputType: "text",
        checkboxClass: "checkbox show"
      });
    } else {
      this.setState({
        passwordInputType: "password",
        checkboxClass: "checkbox"
      });
    }
  }

  render() {
    return (
      <div>
        <br/>
        <br/>
        <br/>
        <section id="login">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <div className="form-wrap">
                  <h1>请登录</h1>
                  <form onSubmit={this.loginHandle.bind(this)}>
                    <div className="form-group">
                      <input
                        className="form-control"
                        placeholder="请输入用户名"
                        ref="usernameInput"
                        onChange={this.handleChange.bind(this)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type={this.state.passwordInputType}
                        name="key"
                        id="key"
                        className="form-control"
                        placeholder="请输入密码"
                        ref="passwordInput"
                        onChange={this.handleChange.bind(this)}
                      />
                    </div>
                    <div
                      className={this.state.checkboxClass}
                      onClick={this.handleShowPassword.bind(this)}
                    >
                      <span className="character-checkbox" />
                      <span className="label">显示密码</span>
                    </div>
                    <input
                      type="submit"
                      className="btn btn-custom btn-lg btn-block"
                      value="登录"
                      disabled={this.state.loginBtnDisable}
                    />
                  </form>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer id="footer">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <p>© 2017 JLZHJT, Inc.</p>
                <p>
                  Powered by{" "}
                  <strong>
                    <a
                      href="http://www.jlzhjt.cn/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Uncle.chao
                    </a>
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

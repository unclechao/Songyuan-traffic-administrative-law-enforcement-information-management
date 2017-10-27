import React, { Component } from "react";
import { Navbar, Nav, MenuItem, NavDropdown } from "react-bootstrap";
import iziToast from "iziToast";
import "izitoast/dist/css/iziToast.min.css";

export default class Header extends Component {
  constructor(props) {
    super(props);
    let storage = window.localStorage;
    if (storage["username"]) {
      this.state = {
        userInfo: "欢迎你," + storage["username"],
        active: "安全退出"
      };
    } else {
      this.state = {
        userInfo: "欢迎你,请登录",
        active: "登录"
      };
    }
  }

  handleClick(e) {
    e.preventDefault();
    let storage = window.localStorage;
    // already login
    if (this.state.active === "安全退出") {
      storage.removeItem("uid");
      storage.removeItem("username");
      storage.removeItem("token");
      iziToast.success({
        title: "成功",
        message: "注销成功",
        transitionIn: "bounceInLeft",
        transitionOut: "fadeOutRight"
      });
      this.setState({
        userInfo: "欢迎你,请登录",
        active: "登录"
      });
      this.props.history.push("/login");
    } else {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <Navbar fixedTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">{this.props.title}</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavDropdown title={this.state.userInfo} id="basic-nav-dropdown">
            <MenuItem onClick={this.handleClick.bind(this)}>
              {this.state.active}
            </MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

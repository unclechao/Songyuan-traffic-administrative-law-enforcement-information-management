import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div className="navbar-default navbar-fixed-bottom">
        <div className="col-lg-12">
          <div className="col-md-8">
            <a>关于</a> | <a>版权所有</a>
          </div>
          <div className="col-md-4">
            <p className="muted pull-right">
              © 2017 JLZHJT,Inc. All rights reserved
            </p>
          </div>
        </div>
      </div>
    );
  }
}

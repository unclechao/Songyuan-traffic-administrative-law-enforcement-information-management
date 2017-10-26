import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div class="row navbar navbar-default navbar-fixed-bottom">
        <div class="col-lg-12">
          <div class="col-md-8">
            <a>关于</a> | <a>版权所有</a>
          </div>
          <div class="col-md-4">
            <p class="muted pull-right">
              © 2017 JLZHJT,Inc. All rights reserved
            </p>
          </div>
        </div>
      </div>
    );
  }
}

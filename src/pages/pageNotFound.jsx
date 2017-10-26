import React, { Component } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

export default class PageNotFound extends Component {
  render() {
    return (
      <div>
        <Header title="松原交通综合行政执法信息管理系统" fatherProps={this.props} />
        <center>
          <div class="container">
            <div class="row">
              <div class="span12">
                <div class="hero-unit">
                  <br />
                  <h1>
                    <big>
                      <font face="Tahoma" color="red">
                        Oops! 404
                      </font>
                    </big>
                  </h1>
                  <br />
                  <p>对不起，您请求的页面不存在</p>
                  <br />
                  <a href="/" class="btn btn-large btn-info">
                    <i class="icon-home icon-white" /> 返回首页
                  </a>
                </div>
                <br />
              </div>
            </div>
          </div>
        </center>
        <Footer />
      </div>
    );
  }
}

import React, { Component } from "react";
import Header from "../components/system/header/header";
import Footer from "../components/system/footer/footer";

export default class PageNotFound extends Component {
  render() {
    return (
      <div>
        <Header title="松原交通综合行政执法信息管理系统" {...this.props} />
        <center>
          <div className="container">
            <div className="row">
              <div className="span12">
                <div className="hero-unit">
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
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
                  <a href="/" className="btn btn-large btn-info">
                    <i className="icon-home icon-white" /> 返回首页
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

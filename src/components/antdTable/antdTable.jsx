import React, { Component } from "react";
import "antd/dist/antd.css";
import { Table } from "antd";

export default class AntdTable extends Component {

  render() {
    return (
      <div>
        <Table
          dataSource={this.props.dataSource}
          columns={this.props.columns}
        />
      </div>
    );
  }
}

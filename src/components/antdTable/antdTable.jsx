import React, { Component } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";

const columns = [
  {
    title: "姓名",
    dataIndex: "Name",
    sorter: true,
    width: "20%"
  },
  {
    title: "性别",
    dataIndex: "Gender",
    filters: [
      { text: "男", value: "男" },
      { text: "女", value: "女" }
    ],
    width: "20%"
  },
  {
    title: "年龄",
    dataIndex: "Age",
    sorter: true
  }
];

export default class AntdTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false
    };
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };
  fetch = (params = {}) => {
    console.log("params:", params);
    this.setState({ loading: true });

    // reqwest({
    //   url: "https://randomuser.me/api",
    //   method: "get",
    //   data: {
    //     results: 10,
    //     ...params
    //   },
    //   type: "json"
    // }).then(data => {
    //   const pagination = { ...this.state.pagination };
    //   // Read total count from server
    //   // pagination.total = data.totalCount;
    //   pagination.total = 200;
    //   this.setState({
    //     loading: false,
    //     data: data.results,
    //     pagination
    //   });
    // });

    const pagination = { ...this.state.pagination };
    pagination.total = 50;
    this.setState({
      loading: false,
      //data: data.results,
      data: [
        {
          key: "1",
          Name: "John Brown",
          Age: 32,
          Gender: "男"
        },
        {
          key: "2",
          Name: "Jesse Zhang",
          Age: 23,
          Gender: "男"
        },
        {
          key: "3",
          Name: "Izz Wang",
          Age: 31,
          Gender: "女"
        },
        {
          key: "4",
          Name: "John Brown",
          Age: 32,
          Gender: "男"
        },
        {
          key: "5",
          Name: "Jesse Zhang",
          Age: 23,
          Gender: "男"
        },
        {
          key: "6",
          Name: "Izz Wang",
          Age: 31,
          Gender: "女"
        },
        {
          key: "7",
          Name: "Jesse Zhang",
          Age: 23,
          Gender: "男"
        },
        {
          key: "8",
          Name: "Izz Wang",
          Age: 31,
          Gender: "女"
        },
        {
          key: "9",
          Name: "Izz Wang",
          Age: 31,
          Gender: "女"
        },
        {
          key: "10",
          Name: "Jesse Zhang",
          Age: 23,
          Gender: "男"
        }
      ],
      pagination
    });
  };
  componentDidMount() {
    this.fetch();
  }

  render() {
    return (
      <Table
        columns={columns}
        rowKey={record => record.key}
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

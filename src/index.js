import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import registerServiceWorker from "./registerServiceWorker";
import R from "./routes";
import { LocaleProvider } from "antd";
import zhCN from "antd/lib/locale-provider/zh_CN";

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <div>
      <R />
    </div>
  </LocaleProvider>,
  document.getElementById("root")
);
registerServiceWorker();

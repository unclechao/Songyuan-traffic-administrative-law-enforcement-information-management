import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import registerServiceWorker from "./registerServiceWorker";
import R from "./routes";

ReactDOM.render(
  <div>
    <R />
  </div>,
  document.getElementById("root")
);
registerServiceWorker();

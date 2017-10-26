var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var cors = require("express-cors");
var constant = require("./lib/constant");
var api = require("./api");

var app = express();
var apiRoutes = express.Router();

app.set("superSecret", constant.SECRET);
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(
  cors({
    allowedOrigins: ["localhost:*"]
  })
);
app.use("/static", express.static("public"));

// connect to Mongo when the app initializes
mongoose.connect(constant.MONGODB_CONN_STR, { useMongoClient: true }, err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connection %s successfully", constant.MONGODB_CONN_STR);
  }
});

// set up the RESTful API, handler methods are defined in api.js
// apply the routes to our application with the prefix /api
app.use("/api", apiRoutes);
// route middleware to verify a token
apiRoutes.use((req, res, next) => {
  if (req.url === "/authorizeLogin") {
    req.reqInfo = {
      remoteAddress: req.connection.remoteAddress
    };
    next();
  } else {
    // check header or url parameters or post parameters for token
    var token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get("superSecret"), (err, decoded) => {
        if (err) {
          return res.status(403).send({
            code: 1,
            validate: false,
            message: "权限校验失败."
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.reqInfo = {
            agent: req.headers["user-agent"],
            referer: req.headers["referer"],
            remoteAddress: req.connection.remoteAddress
          };
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token return an error
      return res.status(403).send({
        code: 1,
        validate: false,
        message: "权限校验失败."
      });
    }
  }
});
//api needs no token
apiRoutes.post("/authorizeLogin", api.authorizeLogin);
//api needs token
apiRoutes.post("/authValidate", api.authValidate);

var server = app.listen(
  process.env.PORT || constant.SERVER_PORT,
  process.env.IP || constant.SERVER_ADDR,
  () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at http://%s:%s", host, port);
  }
);

process.on("uncaughtException", err => {
  console.log(err);
});

var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var app = require("./server");
var user = require("./model/user");

exports.authorizeLogin = (req, res) => {
  user.findOne(
    { username: req.body.username, password: req.body.hashPassword },
    (err, user) => {
      if (err) {
        res.status(500).send({
          code: 0,
          validate: false,
          message: "服务器内部错误"
        });
      } else {
        if (!user) {
          res.status(200).send({
            code: 1,
            validate: false,
            message: "您输入的账号或密码错误,请重试"
          });
        } else {
          if (user.lockState) {
            res.status(200).send({
              code: 1,
              validate: false,
              message: "您的账号状态异常,无法登录"
            });
          } else {
            var token = jwt.sign(
              {
                _id: user._id,
                name: user.username
              },
              req.app.get("superSecret"),
              {
                expiresIn: "1d" // expires in 24 hours
              }
            );
            // return the information including token as JSON
            res.status(200).send({
              code: 1,
              message: "登录成功",
              validate: true,
              uid: user._id,
              username: user.username,
              token: token
            });
          }
        }
      }
    }
  );
};

exports.authValidate = (req, res) => {
  res.status(200).send({
    code: 1,
    message: "权限校验成功.",
    validate: true
  });
};

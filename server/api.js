var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var app = require("./server");
var user = require("./model/user");
var adminVehInfo = require("./model/basicInfo/adminVehInfo");

exports.authorizeLogin = (req, res) => {
  user.findOne(
    { username: req.body.username, password: req.body.hashPassword },
    (err, user) => {
      if (err) {
        res.status(500).send({
          code: -1,
          message: "服务器内部错误"
        });
      } else {
        if (!user) {
          res.status(200).send({
            code: 1001,
            message: "您输入的账号或密码错误,请重试"
          });
        } else {
          if (user.lockState) {
            res.status(200).send({
              code: 1002,
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
              code: 0,
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
    code: 0,
    message: "权限校验成功.",
    validate: true
  });
};

exports.getAdminVehInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = {};
  let sortObj = {};
  if (queryParams.vehType && queryParams.vehType.length != 0) {
    queryObj.$or = [{ vehType: queryParams.vehType }];
  }
  if (queryParams.sortField) {
    sortObj[queryParams.sortField] =
      queryParams.sortOrder === "ascend" ? 1 : -1;
  }

  adminVehInfo.count(queryObj, (err, count) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      adminVehInfo
        .find(queryObj)
        .sort(sortObj)
        .skip((queryParams.page - 1) * queryParams.results)
        .limit(queryParams.results)
        .exec((err, data) => {
          if (err) {
            res.status(500).send({
              code: -1,
              message: "服务器内部错误"
            });
          } else {
            res.status(200).send({
              code: 0,
              totalCount: count,
              data
            });
          }
        });
    }
  });
};

exports.deleteAdminVehInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = { _id: { $in: queryParams } };
  adminVehInfo.remove(queryObj).exec((err, data) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      res.status(200).send({
        code: 0
      });
    }
  });
};

exports.addAdminVehInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryId = queryParams._id ? { _id: queryParams.editId } : {};
  if (
    queryParams.simInput === "" ||
    queryParams.noInput === "" ||
    queryParams.addSelectValue === ""
  ) {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    adminVehInfo.findOneAndUpdate(
      queryId,
      {
        $set: {
          simNo: queryParams.simInput,
          vehNo: queryParams.noInput,
          vehType: queryParams.addSelectValue
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).send({
            code: -1,
            message: "服务器内部错误"
          });
        } else {
          res.status(200).send({
            code: 0,
            message: "操作成功"
          });
        }
      }
    );
  }
};

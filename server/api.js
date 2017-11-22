var jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
var app = require("./server");
var user = require("./model/user");
var adminVehInfo = require("./model/basicInfo/adminVehInfo");
var adminOrganInfo = require("./model/basicInfo/adminOrganInfo");
var adminPeopleInfo = require("./model/basicInfo/adminPeopleInfo");
var adminEquipmentInfo = require("./model/basicInfo/adminEquipmentInfo");
var enforcementInspection = require("./model/enforcementAttendance/enforcementInspection");
var attendanceInfo = require("./model/enforcementAttendance/attendanceInfo");
var workOrder = require("./model/workOrder/workOrder");

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
  let queryId = queryParams.editId
    ? { _id: queryParams.editId }
    : { _id: mongoose.Types.ObjectId() };
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
          vehType: queryParams.addSelectValue,
          organ: queryParams.addOrganSelectValue
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

exports.getAdminOrganInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = {};
  let sortObj = {};
  if (queryParams.sortField) {
    sortObj[queryParams.sortField] =
      queryParams.sortOrder === "ascend" ? 1 : -1;
  }
  adminOrganInfo.count(queryObj, (err, count) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      adminOrganInfo
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

exports.deleteAdminOrganInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = { _id: { $in: queryParams } };
  adminOrganInfo.remove(queryObj).exec((err, data) => {
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

exports.addAdminOrganInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryId = queryParams.editId
    ? { _id: queryParams.editId }
    : { _id: mongoose.Types.ObjectId() };
  if (queryParams.organNo === "" || queryParams.organName === "") {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    adminOrganInfo.findOneAndUpdate(
      queryId,
      {
        $set: {
          organNo: queryParams.organNo,
          organName: queryParams.organName,
          contactName: queryParams.contactName,
          contactPhone: queryParams.contactPhone
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

exports.getAdminOrganInfoNameList = (req, res) => {
  adminOrganInfo.find({}, "organName").exec((err, data) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      res.status(200).send({
        code: 0,
        data
      });
    }
  });
};

exports.getAdminPeopleInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = {};
  let sortObj = {};
  if (queryParams.sex && queryParams.sex.length != 0) {
    queryObj.$or = [{ sex: queryParams.sex }];
  }
  if (queryParams.sortField) {
    sortObj[queryParams.sortField] =
      queryParams.sortOrder === "ascend" ? 1 : -1;
  }
  adminPeopleInfo.count(queryObj, (err, count) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      adminPeopleInfo
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

exports.deleteAdminPeopleInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = { _id: { $in: queryParams } };
  adminPeopleInfo.remove(queryObj).exec((err, data) => {
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

exports.addAdminPeopleInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryId = queryParams.editId
    ? { _id: queryParams.editId }
    : { _id: mongoose.Types.ObjectId() };
  if (
    queryParams.nameInput === "" ||
    queryParams.noInput === "" ||
    queryParams.addSexSelectValue === "" ||
    queryParams.addOrganSelectValue === ""
  ) {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    adminPeopleInfo.findOneAndUpdate(
      queryId,
      {
        $set: {
          no: queryParams.noInput,
          name: queryParams.nameInput,
          sex: queryParams.addSexSelectValue,
          phone: queryParams.phoneInput,
          organ: queryParams.addOrganSelectValue
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

exports.getAdminEquipmentInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = {};
  let sortObj = {};
  if (queryParams.sortField) {
    sortObj[queryParams.sortField] =
      queryParams.sortOrder === "ascend" ? 1 : -1;
  }
  adminEquipmentInfo.count(queryObj, (err, count) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      adminEquipmentInfo
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

exports.deleteAdminEquipmentInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = { _id: { $in: queryParams } };
  adminEquipmentInfo.remove(queryObj).exec((err, data) => {
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

exports.addAdminEquipmentInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryId = queryParams.editId
    ? { _id: queryParams.editId }
    : { _id: mongoose.Types.ObjectId() };
  if (
    queryParams.noInput === "" ||
    queryParams.nameInput === "" ||
    queryParams.organName === ""
  ) {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    adminEquipmentInfo.findOneAndUpdate(
      queryId,
      {
        $set: {
          equipmentNo: queryParams.noInput,
          equipmentName: queryParams.nameInput,
          count: queryParams.countInput,
          organ: queryParams.addOrganSelectValue
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

exports.getEnforcementInspectionData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = {};
  let sortObj = {};
  if (queryParams.sortField) {
    sortObj[queryParams.sortField] =
      queryParams.sortOrder === "ascend" ? 1 : -1;
  }
  enforcementInspection.count(queryObj, (err, count) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      enforcementInspection
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

exports.addEnforcementInspectionData = (req, res) => {
  let queryParams = req.body.params;
  let queryId = queryParams.editId
    ? { _id: queryParams.editId }
    : { _id: mongoose.Types.ObjectId() };
  if (
    queryParams.dateInput === null ||
    queryParams.locationInput === "" ||
    queryParams.checkObject === ""
  ) {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    enforcementInspection.findOneAndUpdate(
      queryId,
      {
        $set: {
          inspectionTime: queryParams.dateInput,
          location: queryParams.locationInput,
          checkObject: queryParams.checkObject,
          organ: queryParams.addOrganSelectValue,
          remark: queryParams.recordInput
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

exports.deleteEnforcementInspectionData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = { _id: { $in: queryParams } };
  enforcementInspection.remove(queryObj).exec((err, data) => {
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

exports.getAttendanceInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = {};
  let sortObj = {};
  if (queryParams.sortField) {
    sortObj[queryParams.sortField] =
      queryParams.sortOrder === "ascend" ? 1 : -1;
  }
  attendanceInfo.count(queryObj, (err, count) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      attendanceInfo
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

exports.deleteAttendanceInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryObj = { _id: { $in: queryParams } };
  attendanceInfo.remove(queryObj).exec((err, data) => {
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

exports.addAttendanceInfoData = (req, res) => {
  let queryParams = req.body.params;
  let queryId = queryParams.editId
    ? { _id: queryParams.editId }
    : { _id: mongoose.Types.ObjectId() };
  if (queryParams.dateInput === null || queryParams.locationInput === "") {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    attendanceInfo.findOneAndUpdate(
      queryId,
      {
        $set: {
          time: queryParams.dateInput,
          location: queryParams.locationInput,
          organ: queryParams.addOrganSelectValue,
          remark: queryParams.recordInput,
          people: queryParams.people
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

exports.getOrganPeopleNameList = (req, res) => {
  let queryParams = req.body;
  let queryObj = {};
  queryObj.organ = queryParams.organ;
  adminPeopleInfo.find(queryObj).exec((err, data) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      res.status(200).send({
        code: 0,
        data
      });
    }
  });
};

exports.getOrganAndPeopleTreeList = (req, res) => {
  let resArr = [];
  adminOrganInfo.find({}, "organName").exec((err, data) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      let index = 0;
      data.map(item => {
        adminPeopleInfo.find({ organ: item.organName }).exec((err, people) => {
          let tempChildrenArr = [];
          people.map(p => {
            tempChildrenArr.push({
              title: p.name,
              key: p._id
            });
          });
          resArr.push({
            title: item.organName,
            key: item._id,
            children: tempChildrenArr
          });
          index++;
          if (index == data.length) {
            res.status(200).send({
              code: 0,
              data: resArr
            });
          }
        });
      });
    }
  });
};

exports.getOrganAndVehTreeList = (req, res) => {
  let resArr = [];
  adminOrganInfo.find({}, "organName").exec((err, data) => {
    if (err) {
      res.status(500).send({
        code: -1,
        message: "服务器内部错误"
      });
    } else {
      let index = 0;
      data.map(item => {
        adminVehInfo.find({ organ: item.organName }).exec((err, veh) => {
          let tempChildrenArr = [];
          veh.map(p => {
            tempChildrenArr.push({
              title: p.vehNo,
              key: p._id
            });
          });
          resArr.push({
            title: item.organName,
            key: item._id,
            children: tempChildrenArr
          });
          index++;
          if (index == data.length) {
            res.status(200).send({
              code: 0,
              data: resArr
            });
          }
        });
      });
    }
  });
};

exports.addWorkOrder = (req, res) => {
  let queryParams = req.body.params;
  if (
    queryParams.no === "" ||
    queryParams.importantLevel === "" ||
    queryParams.describe === ""
  ) {
    res.status(200).send({
      code: 2001,
      message: "请求参数错误"
    });
  } else {
    workOrder.findOneAndUpdate(
      { no: queryParams.no },
      {
        $set: {
          time: queryParams.time,
          describe: queryParams.describe,
          no: queryParams.no,
          importantLevel: queryParams.importantLevel,
          state: "待解决"
        }
      },
      { upsert: true },
      (err, doc) => {
        if (err) {
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

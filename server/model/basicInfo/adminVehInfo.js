var mongoose = require("mongoose");

var adminVehInfoSchema = new mongoose.Schema({
  simNo: { type: String, required: true, unique: true, index: true },
  vehNo: { type: String, required: true, unique: true, index: true },
  vehType: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var AdminVehInfo = mongoose.model("AdminVehInfo", adminVehInfoSchema);

// 测试数据
AdminVehInfo.count().exec((err, count) => {
  if (err) {
    console.log(err);
  } else if (count < 1) {
    var initdata = [
      {
        simNo: "1",
        vehNo: "吉A95425",
        vehType: "大众"
      },
      {
        simNo: "2",
        vehNo: "吉A755672",
        vehType: "捷达"
      },
      {
        simNo: "3",
        vehNo: "吉AB2135",
        vehType: "丰田"
      },
      {
        simNo: "4",
        vehNo: "吉A51372",
        vehType: "捷达"
      },
      {
        simNo: "5",
        vehNo: "吉AC0994",
        vehType: "丰田"
      },
      {
        simNo: "6",
        vehNo: "吉A95425",
        vehType: "大众"
      },
      {
        simNo: "7",
        vehNo: "吉A755672",
        vehType: "捷达"
      },
      {
        simNo: "8",
        vehNo: "吉AB2135",
        vehType: "丰田"
      },
      {
        simNo: "9",
        vehNo: "吉A51372",
        vehType: "捷达"
      },
      {
        simNo: "10",
        vehNo: "吉AC0994",
        vehType: "丰田"
      },
      {
        simNo: "11",
        vehNo: "吉A95425",
        vehType: "大众"
      },
      {
        simNo: "12",
        vehNo: "吉A755672",
        vehType: "捷达"
      },
      {
        simNo: "13",
        vehNo: "吉AB2135",
        vehType: "丰田"
      },
      {
        simNo: "14",
        vehNo: "吉A51372",
        vehType: "捷达"
      },
      {
        simNo: "15",
        vehNo: "吉AC0994",
        vehType: "丰田"
      }
    ];
    AdminVehInfo.insertMany(initdata)
      .then(initdata => {
        console.log("AdminVehInfo collection init successful");
      })
      .catch(err => {
        console.log(err);
      });
  }
});
// end 测试数据

module.exports = AdminVehInfo;

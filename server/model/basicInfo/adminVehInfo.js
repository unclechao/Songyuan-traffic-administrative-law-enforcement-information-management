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
        simNo: "78124335",
        vehNo: "吉A95425",
        vehType: "大众"
      },
      {
        simNo: "54623457",
        vehNo: "吉A755672",
        vehType: "捷达"
      },
      {
        simNo: "75241346",
        vehNo: "吉AB2135",
        vehType: "丰田"
      },
      {
        simNo: "19388474",
        vehNo: "吉A51372",
        vehType: "捷达"
      },
      {
        simNo: "79876523",
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

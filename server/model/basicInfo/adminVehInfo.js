var mongoose = require("mongoose");

var adminVehInfoSchema = new mongoose.Schema({
  simNo: { type: String, required: true, unique: true, index: true },
  vehNo: { type: String, required: true, unique: true, index: true },
  vehType: { type: String },
  organ: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var AdminVehInfo = mongoose.model("AdminVehInfo", adminVehInfoSchema);

module.exports = AdminVehInfo;

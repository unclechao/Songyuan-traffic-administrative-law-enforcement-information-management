var mongoose = require("mongoose");

var adminOrganInfoSchema = new mongoose.Schema({
  organNo: { type: String, unique: true, index: true },
  organName: { type: String, required: true, unique: true, index: true },
  contactName: { type: String },
  contactPhone: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var AdminOrganInfo = mongoose.model("AdminVehInfo", adminOrganInfoSchema);

module.exports = AdminOrganInfo;

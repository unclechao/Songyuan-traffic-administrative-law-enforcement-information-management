var mongoose = require("mongoose");

var enforcementInspectionSchema = new mongoose.Schema({
  inspectionTime: { type: Date, required: true },
  location: { type: String, required: true },
  chenkObject: { type: String, required: true },
  organ: { type: String, required: true },
  remark: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var EnforcementInspection = mongoose.model(
  "EnforcementInspection",
  enforcementInspectionSchema
);

module.exports = EnforcementInspection;

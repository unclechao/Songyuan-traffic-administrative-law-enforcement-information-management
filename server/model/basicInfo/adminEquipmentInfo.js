var mongoose = require("mongoose");

var adminEquipmentInfoSchema = new mongoose.Schema({
  equipmentNo: { type: String, unique: true, index: true },
  equipmentName: { type: String, required: true, unique: true, index: true },
  count: { type: Number, min: 0 },
  organ: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var AdminEquipmentInfo = mongoose.model(
  "AdminEquipmentInfo",
  adminEquipmentInfoSchema
);

module.exports = AdminEquipmentInfo;

var mongoose = require("mongoose");

var attendanceInfoSchema = new mongoose.Schema({
  time: { type: Date, required: true },
  location: { type: String, required: true },
  people: [String],
  organ: { type: String, required: true },
  remark: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var AttendanceInfo = mongoose.model("AttendanceInfo", attendanceInfoSchema);

module.exports = AttendanceInfo;

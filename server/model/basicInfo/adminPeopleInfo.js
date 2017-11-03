var mongoose = require("mongoose");

var adminPeopleInfoSchema = new mongoose.Schema({
  no: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, unique: true, index: true },
  sex: { type: String },
  phone: { type: String },
  organ: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var AdminPeopleInfo = mongoose.model("AdminPeopleInfo", adminPeopleInfoSchema);

module.exports = AdminPeopleInfo;

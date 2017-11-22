var mongoose = require("mongoose");

var workOrderSchema = new mongoose.Schema({
  no: { type: String, required: true },
  time: { type: Date, required: true },
  importantLevel: { type: String, required: true },
  describe: { type: String, required: true },
  state: { type: String },
  dealResult: { type: String },
  dealPeople: { type: String },
  createTime: { type: Date },
  editTime: { type: Date, default: Date.now }
});

var WorkOrder = mongoose.model("WorkOrder", workOrderSchema);

module.exports = WorkOrder;

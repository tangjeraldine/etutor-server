const mongoose = require("mongoose");

const ClassesSchema = new mongoose.Schema({
  classTitle: { type: String, required: true },
  subject: { type: String, required: true },
  timeDay: { type: String, required: true },
  tutor: { type: String, required: true },
  booked: { type: Boolean, required: true, default: false },
  bookedBy: { type: Array, required: true, default: [] },
  groupSize: { type: Number, required: true, min: 1 },
});

const Classes = mongoose.model("Classes", ClassesSchema);

module.exports = Classes;

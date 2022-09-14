const mongoose = require("mongoose");

const ClassesSchema = new mongoose.Schema({
  classTitle: { type: String, required: true },
  subject: { type: String, required: true },
  timeDay: { type: Date, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutors" },
  bookedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutees" },
  groupSize: { type: Number, required: true, min: 1 },
});

const Classes = mongoose.model("Classes", ClassesSchema);

module.exports = Classes;

const mongoose = require("mongoose");

const TutorsSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  rates: { type: Number, required: true, min: 0 },
  rating: { type: Number, min: 1, max: 5 },
  classType: { type: String, required: true }, //in-person or remote, or inperson&remote (drop down)
  classLevel: { type: Array, required: true, default: [] }, //pri 1-6, sec 1-5
  region: { type: String, required: true }, //north south east west central
  subjects: { type: Array, required: true, default: [] },
  educationBackground: { type: String, required: true },
  teachingExperience: { type: String, required: true },
  // myTutees: { type: Array, default: [{}] },
  // pendingTutees: { type: Array, default: [{}] },
});

const Tutors = mongoose.model("Tutors", TutorsSchema);

module.exports = Tutors;

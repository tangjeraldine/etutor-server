const mongoose = require("mongoose");

const TuteesSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  preferredContactMode: { type: String, required: true }, //phone or email (drop-down)
  currentLevel: { type: String, required: true },
  region: { type: String, required: true }, //house to house tuition
  subjects: { type: Array, required: true, default: [] },
  myTutors: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutors" },
  pendingTutors: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutors" },
  favTutors: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutors" },
});

const Tutees = mongoose.model("Tutees", TuteesSchema);

module.exports = Tutees;

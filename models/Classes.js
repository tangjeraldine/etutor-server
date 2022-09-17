const mongoose = require("mongoose");

const ClassesSchema = new mongoose.Schema({
  classTitle: {
    type: String,
    required: true,
    minlength: [4, "Class title needs to be at least 4 char long."],
    maxlength: [30, "Max length of class title is 30 char."],
  },
  subject: {
    type: String,
    enum: [
      "English",
      "Mathematics",
      "Science",
      "Additional Mathematics",
      "Elementary Mathematics",
      "Biology",
      "Physics",
      "Chemistry",
    ],
    required: true,
  },
  timeDay: { type: Date, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Tutors" },
  bookedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutees" },
  groupSize: { type: Number, required: true, min: 1 },
});

const Classes = mongoose.model("Classes", ClassesSchema);

module.exports = Classes;

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
  classLevel: {
    type: String,
    enum: [
      "Primary 1",
      "Primary 2",
      "Primary 3",
      "Primary 4",
      "Primary 5",
      "Primary 6",
      "Secondary 1",
      "Secondary 2",
      "Secondary 3",
      "Secondary 4",
      "Secondary 5",
    ],
    required: [true, "Class level is required."],
  },
  classType: {
    type: String,
    enum: ["In-Person", "Remote"],
    required: [true, "Class type is required."],
  },
  timeDay: { type: Date, default: (() => new Date()) },//i remove required n change this to have default isntead bc doesnt work when its required w default
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutors",
    required: true,
  },
  bookedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tutees",
    default: [],
  },
  groupSize: { type: Number, required: true, min: 1 },
});

const Classes = mongoose.model("Classes", ClassesSchema);

module.exports = Classes;

//do we need class level? forgot if we discussed this alr....

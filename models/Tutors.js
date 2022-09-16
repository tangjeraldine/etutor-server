const mongoose = require("mongoose");

const TutorsSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  fullName: {
    type: String,
    minlength: [4, "Needs to contain at least 4 characters."],
    maxlength: [30, "Max length of name is 30 characters."],
    required: [true, "Full name is required."],
  },
  email: { type: String, required: true },
  phone: {
    type: Number,
    minlength: [8, "Needs to be at least 8 digits."],
    required: true,
  },
  rates: {
    type: Number,
    required: true,
    min: [0, "Rates cannot be less than zero."],
    minlength: [1, "Needs to be at least 1 digit."],
  },
  rating: { type: Number, min: 1, max: 5 },
  classType: {
    type: String,
    enum: ["In-Person", "Remote", "Both In-Person and Remote"],
    required: true,
  },
  classLevel: {
    type: Array,
    // enum: [
    //   "Primary 1",
    //   "Primary 2",
    //   "Primary 3",
    //   "Primary 4",
    //   "Primary 5",
    //   "Primary 6",
    //   "Secondary 1",
    //   "Secondary 2",
    //   "Secondary 3",
    //   "Secondary 4",
    //   "Secondary 5",
    // ],
    required: true,
    default: [],
  },
  region: {
    type: String,
    enum: ["North", "South", "East", "West", "Central"],
    required: true,
  }, //north south east west central
  subjects: {
    type: Array,
    // enum: [
    //   "English",
    //   "Mathematics",
    //   "Science",
    //   "Additional Mathematics",
    //   "Elementary Mathematics",
    //   "Biology",
    //   "Physics",
    //   "Chemistry",
    // ],
    required: true,
    default: [],
  },
  educationBackground: { type: String, required: true },
  teachingExperience: { type: String, required: true },
  // myTutees: { type: Array, default: [{}] },
  // pendingTutees: { type: Array, default: [{}] },
});

const Tutors = mongoose.model("Tutors", TutorsSchema);

module.exports = Tutors;

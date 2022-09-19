const mongoose = require("mongoose");
const validator = require("validator");

const TutorsSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  fullName: {
    type: String,
    minlength: [4, "Needs to contain at least 4 characters."],
    maxlength: [30, "Max length of name is 30 characters."],
    required: [true, "Full name is required."],
  },
  phone: {
    type: String,
    minlength: [8, "Needs to be at least 8 digits."],
    maxlength: [20, "Exceeded the max length of 20 digits."],
    validate(value) {
      if (!validator.isMobilePhone(value, "en-SG")) {
        console.log("Phone number is invalid");
      }
    },
    required: [true, "A phone number is required."],
  },
  region: {
    type: String,
    enum: ["North", "South", "East", "West", "Central"],
    required: [true, "A region is required."],
  },
  rates: {
    type: Number,
    required: [true, "Rates are required."],
    min: [0, "Rates cannot be less than zero."],
    max: [1000, "Rates cannot be higher than 1000."],
    minlength: [1, "Needs to be at least 1 digit."],
  },
  rating: { type: Number, min: 1, max: 5 },
  classType: {
    type: [String],
    enum: ["In-Person", "Remote"],
    required: [true, "Class type is required."],
    default: [],
  },
  classLevel: {
    type: [String],
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
    default: [],
  },
  subjects: {
    type: [String],
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
    required: [true, "Subject is required."],
    default: [],
  },
  educationBackground: {
    type: String,
    required: [true, "Education background is required."],
  },
  teachingExperience: {
    type: String,
    required: [true, "Teaching experience is required."],
  },
});

const Tutors = mongoose.model("Tutors", TutorsSchema);

module.exports = Tutors;

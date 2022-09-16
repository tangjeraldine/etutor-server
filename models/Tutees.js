const mongoose = require("mongoose");
const validator = require("validator");

const TuteesSchema = new mongoose.Schema({
  username: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  fullName: {
    type: String,
    minlength: [4, "Needs to contain at least 4 characters."],
    maxlength: [30, "Max length of name is 30 characters."],
    required: [true, "Full name is required."],
  },
  email: {
    type: String,
    minlength: [6, "Needs to contain at least 4 characters."],
    maxlength: [30, "Exceeded the max length of 30 characters."],
    required: true,
  },
  phone: {
    type: Number,
    minlength: [8, "Needs to be at least 8 digits."],
    validate(value) {
      if (!validator.isMobilePhone(value, "en-SG")) {
        console.log("Phone number is invalid");
      }
    },
    required: true,
  },
  region: {
    type: String,
    enum: ["North", "South", "East", "West", "Central"],
    required: true,
  },
  preferredContactMode: {
    type: String,
    enum: ["Phone Call", "Email", "WhatsApp Message"],
    required: true,
  },
  currentLevel: {
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
    required: true,
  },
  subjects: {
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
  myTutors: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutors" },
  pendingTutors: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutors" },
  favTutors: { type: [mongoose.Schema.Types.ObjectId], ref: "Tutors" },
});

const Tutees = mongoose.model("Tutees", TuteesSchema);

module.exports = Tutees;

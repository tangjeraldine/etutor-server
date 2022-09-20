const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: [5, "Username needs to be between 5-20 characters long."],
    maxlength: [20, "Username needs to be between 5-20 characters long."],
    required: [true, "Username is required."],
  },
  password: {
    type: String,
    // minlength: [10, "Username needs to be between 10-16 characters long."],
    // maxlength: [16, "Username needs to be between 10-16 characters long."],
    required: [true, "Password is required."],
  },
  userType: {
    type: String,
    enum: ["Tutor", "Tutee"],
    required: [true, "User type is required."],
  },
  email: {
    type: String,
    minlength: [6, "Needs to contain at least 4 characters."],
    maxlength: [30, "Exceeded the max length of 30 characters."],
    required: [true, "An email address is required."],
  },
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;

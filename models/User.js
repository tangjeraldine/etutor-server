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
    required: [true, "Password is required."],
  },
  userType: {
    type: String,
    enum: ["Tutor", "Tutee"],
    required: [true, "User type is required."],
  },
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;

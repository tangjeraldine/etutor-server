const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  //-->validation to ensure its unique
  password: { type: String, required: true },
  userType: { type: String, required: true }, //depends on signup as tutor or tutee on start page
});

const Users = mongoose.model("Users", UsersSchema);

module.exports = Users;

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

const SECRET = process.env.SECRET ?? "MaryJerDew";

router.post("/login", async (req, res) => {
  const { username, password, userType } = req.body;
  const user = await User.findOne({ username });
  if (user === null) {
    res.status(401).send({ error: "No user" });
  } else if (bcrypt.compareSync(password, user.password)) {
    const userid = user._id;
    const username = user.username;
    const userTYPE = user.userType;
    const payload = { userid, username, userTYPE };
    const token = jwt.sign(payload, SECRET, { expiresIn: "5m" });
    res.status(200).send({ msg: "Successful login", token });
  } else {
    res.status(401).send({ error: "Validation failed." });
  }
});

// Seed for User //! --> use hashing function to hash passwords
router.get("/seed", async (req, res) => {
  const users = [
    {
      username: "Karen101",
      password: bcrypt.hashSync("iwanttoseeyourmanager", 10),
      userType: "tutor",
    },
    {
      username: "John",
      password: bcrypt.hashSync("youcantseeme1234", 10),
      userType: "tutor",
    },
    {
      username: "paullee70",
      password: bcrypt.hashSync("ilovejohncena", 10),
      userType: "tutor",
    },
    {
      username: "sarah12",
      password: bcrypt.hashSync("maths4lyfe", 10),
      userType: "tutee",
    },
    {
      username: "George3.14159",
      password: bcrypt.hashSync("lifeofpi", 10),
      userType: "tutee",
    },
    {
      username: "James",
      password: bcrypt.hashSync("bangbang", 10),
      userType: "tutee",
    },
  ];
  await User.deleteMany({});
  const result = await User.insertMany(users);
  res.json(result);
});

module.exports = router;
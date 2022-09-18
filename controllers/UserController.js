const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SignInValidation = require("../Validations/SignInValidation");
const SignUpValidation = require("../Validations/SignUpValidation");
const bcrypt = require("bcrypt");
const router = express.Router();

const SECRET = process.env.SECRET ?? "MaryJerDew";

//* Middleware for validation
const validation = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};

router.post("/signin", validation(SignInValidation), async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user === null) {
    res.status(401).send({ error: "No user" });
  } else if (bcrypt.compareSync(password, user.password)) {
    const payload = { user };
    const token = jwt.sign(payload, SECRET, { expiresIn: "5m" });
    res.status(200).send({ msg: "Successful login", token });
  } else {
    res.status(401).send({ error: "Validation failed." });
  }
});

router.post("/signup", validation(SignUpValidation), async (req, res) => {
  const newUser = req.body;
  const newUsername = newUser.username;
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  try {
    const thisUsername = await User.findOne({ username: newUsername });
    if (thisUsername === null) {
      User.create(newUser, (error, user) => {
        console.log(error);
        if (error) {
          res.status(500).json({ error: "No user created." });
        } else {
          res.status(200).json(user);
        }
      });
    } else if (thisUsername.username === newUsername) {
      res.status(400).send({ error: "This username has been taken." });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put(
  "/edituserdetails/:id",
  validation(SignUpValidation),
  async (req, res) => {
    const { id } = req.params;
    const editedUserDetails = req.body;
    // console.log("editedProfile1", editedProfile);
    // const showThisTutor = await Tutors.findOne({ username: id });
    try {
      const updatedUser = await Tutees.findOneAndUpdate(id, editedUserDetails, {
        new: true,
      });
      // console.log("editedProfile2", editedProfile);
      // console.log("updatedTutee", updatedTutee);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "New user details could not be updated." });
    }
  }
);

// Seed for User //! --> use hashing function to hash passwords
router.get("/seed", validation(SignUpValidation), async (req, res) => {
  const users = [
    {
      username: "Karen101",
      password: bcrypt.hashSync("iw@nttoseeY0U", 10),
      userType: "Tutor",
      email: "karentanyy@gmail.com",
    },
    {
      username: "JohnCeeCee",
      password: bcrypt.hashSync("Youc@ntseeme1234", 10),
      userType: "Tutor",
      email: "johncena@gmail.com",
    },
    {
      username: "paullee70",
      password: bcrypt.hashSync("iLov^JohnCen4", 10),
      userType: "Tutor",
      email: "paullee@gmail.com",
    },
    {
      username: "sarahhh12",
      password: bcrypt.hashSync("mAtHs4lYfE!!", 10),
      userType: "Tutee",
      email: "sarah12@gmail.com",
    },
    {
      username: "George3.14159",
      password: bcrypt.hashSync("Lifeofpi#3142", 10),
      userType: "Tutee",
      email: "iamastudent@gmail.com",
    },
    {
      username: "James",
      password: bcrypt.hashSync("b@@ngb@@ng007", 10),
      userType: "Tutee",
      email: "007@bond.com",
    },
  ];
  await User.deleteMany({});
  const result = await User.insertMany(users);
  res.json(result);
});

module.exports = router;

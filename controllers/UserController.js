const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
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
  const user = await Users.findOne({ username });
  console.l;
  if (user === null) {
    res.status(401).send({ error: "No user." });
  } else if (bcrypt.compareSync(password, user.password)) {
    const payload = { user };
    const token = jwt.sign(payload, SECRET);
    res.status(200).send({ msg: "Successful login", token });
  } else {
    res.status(401).send({ error: "Validation failed." });
  }
});

router.post("/signup", validation(SignUpValidation), async (req, res) => {
  const newUser = req.body;
  const newUsername = newUser.username;
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  const thisUsername = await Users.findOne({ username: newUsername });
  const thisNewEmail = await Users.findOne({ email: newUser.email });
  if (thisUsername === null && thisNewEmail === null) {
    Users.create(newUser, (error, user) => {
      console.log(error);
      if (error) {
        res.status(500).json({ error: "User unable to be created." });
      } else {
        res.status(200).json(user);
      }
    });
  } else {
    if (thisUsername.username === newUsername) {
      res.status(400).send({ error: "This username has been taken." });
    }
    if (thisNewEmail.email === newUser.email) {
      res.status(400).send({ error: "This email address is already in use." });
    }
  }
});

router.get("/viewuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ViewThisUser = await Users.findOne({ _id: id });
    res.status(200).send(ViewThisUser);
  } catch (error) {
    res.status(400).send({ error: "User details cannot be retrieved." });
  }
});

router.put(
  "/edituserdetails/:id",
  validation(SignUpValidation),
  async (req, res) => {
    const { id } = req.params;
    const editedUserDetails = req.body;
    console.log("editedUserDetails1", editedUserDetails);
    try {
      const findUserEmail = await Users.findOne({
        email: editedUserDetails.email,
      });
      const findUserUsername = await Users.findOne({
        username: editedUserDetails.username,
      });
      if (findUserEmail === null && findUserUsername === null) {
        const updatedUser = await Users.findOneAndUpdate(
          id,
          {
            username: editedUserDetails.username,
            password: bcrypt.hashSync(editedUserDetails.password, 10),
            email: editedUserDetails.email,
            //! what if current user changes their email to another email that is already in use? Where to apply the conditional to eliminate this from happening
          },
          {
            new: true,
          }
        );
      } else if (findUserEmail !== null) {
        res.status(401).send({ error: "Email provided is already in use." });
      } else if (findUserUsername !== null) {
        res.status(401).send({ error: "Username provided is already in use." });
      }

      console.log("editedUserDetails2", editedUserDetails);
      console.log("updatedUser", updatedUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "New user details could not be updated." });
    }
  }
);

module.exports = router;

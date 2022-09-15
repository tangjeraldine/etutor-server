const express = require("express");
const jwt = require("jsonwebtoken");
//test out middleware to see if we require bcrypt in the controller
const User = require("../models/User");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

//userTypeIsTutor middleware
const userTypeIsTutor = async (req, res, next) => {
  const bearer = req.get("Authorization");
  const token = bearer.split(" ")[1];
  try {
    res.locals.payload = jwt.verify(token, SECRET);
    if (res.locals.payload.userTYPE === "tutor") {
      // res.send(res.locals.payload);
      next();
    } else {
      res.status(401).send("You are not authorised to view this page.");
    }
  } catch (error) {
    res.status(401).send({ error });
  }
};

// Get to tutors page where user can access their own information
router.get("/", userTypeIsTutor, async (req, res) => {
  try {
    //! Change to find that one tutor's class info by username
    // const payload = req.headers.authorization;
    const payload = res.locals.payload;
    const currentTutor = await Tutors.find({ username: payload.username });
    res.status(200).send(currentTutor);
    //! Show that one tutor's calendar information
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/profile-signup", async (req, res) => {
  const newTutor = req.body;
  const newSignUpEmail = newTutor.email;
  try {
    const thisNewEmail = await Tutors.findOne({ email: newSignUpEmail });
    console.log(thisNewEmail, newSignUpEmail);
    if (thisNewEmail.email === newSignUpEmail) {
      res.status(400).send({ error: "This email address is not available." });
    } else {
      Tutors.create(newTutor, (error, tutor) => {
        if (error) {
          res.status(500).json({ error: "No tutor account created." });
        } else {
          res.status(200).json(tutor);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

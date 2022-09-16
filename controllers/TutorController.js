const express = require("express");
const jwt = require("jsonwebtoken");
//test out middleware to see if we require bcrypt in the controller
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const TutorProfileValidation = require("../Validations/TutorProfileValidation");
const Users = require("../models/User");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

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

//userTypeIsTutor middleware
const userTypeIsTutor = async (req, res, next) => {
  const bearer = req.get("Authorization");
  const token = bearer.split(" ")[1];
  try {
    res.locals.payload = jwt.verify(token, SECRET);
    if (res.locals.payload.userTYPE === "Tutor") {
      // res.send(res.locals.payload);
      next();
    } else {
      res.status(401).send("You are not authorised to view this page.");
    }
  } catch (error) {
    res.status(401).send({ error });
  }
};

// Find all tutor
router.get("/", userTypeIsTutor, async (req, res) => {
  try {
    const allTutor = await Tutors.find();
    res.status(200).send(allTutor);
  } catch (error) {
    res.status(500).send(error);
  }
});

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

router.post(
  "/profile-signup",
  validation(TutorProfileValidation),
  async (req, res) => {
    const newTutor = req.body;
    const newSignUpEmail = newTutor.email;
    try {
      const thisNewEmail = await Tutors.findOne({ email: newSignUpEmail });
      console.log(thisNewEmail, newSignUpEmail);
      if (thisNewEmail === null) {
        Tutors.create(newTutor, (error, tutor) => {
          if (error) {
            res.status(500).json({ error: "No tutor account created." });
          } else {
            res.status(200).json(tutor);
          }
        });
      } else if (thisNewEmail.email === newSignUpEmail) {
        res.status(400).send({ error: "This email address is not available." });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.put("/editprofile/:id", async (req, res) => {
  Users[req.params.id] = req.body;
  console.log(Users[req.params.id]);
  // const findThisTutor = await Tutors.findOne({username: })
});

module.exports = router;

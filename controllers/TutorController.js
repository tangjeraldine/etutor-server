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

// Find all tutor w pagination
router.get("/", async (req, res) => {
  try {
    const { page = 0 } = req.query;
    console.log(req.query);
    const PAGE_SIZE = 5;
    const total = await Tutors.countDocuments({});
    const allTutor = await Tutors.find({}, null, {
      skip: parseInt(page) * PAGE_SIZE,
      limit: PAGE_SIZE,
    });
    res
      .status(200)
      .send({ totalPages: Math.ceil(total / PAGE_SIZE), allTutor });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Filter tutors by subjects,classType and classLevel
// fix required
router.get("/search", async (req, res) => {
  let subjects = req.query.subjects;
  let classType = req.query.classType;
  let classLevel = req.query.classLevel;
  console.log("subjects", subjects);
  console.log("classType", classType);
  console.log("classLevel", classLevel);
  try {
    const filteredTutor = await Tutors.find({
      subjects: [subjects],
      classType: [classType],
      classLevel: classLevel,
    }).exec();

    res.status(200).send(filteredTutor);
  } catch (error) {
    console.log(error);
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
    const thisNewEmail = await Tutors.findOne({ email: newSignUpEmail });
    console.log(thisNewEmail, newSignUpEmail);
    if (thisNewEmail === null) {
      Tutors.create(newTutor, (error, tutor) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Tutor profile unable to be set up." });
        } else {
          res.status(200).json(tutor);
        }
      });
    } else if (thisNewEmail.email === newSignUpEmail) {
      res.status(400).send({ error: "This email address is already in use." });
    }
  }
);

router.put(
  "/editprofile/:id",
  validation(TutorProfileValidation),
  async (req, res) => {
    const { id } = req.params;
    const editedProfile = req.body;
    console.log("editedProfile1", editedProfile);
    // const showThisTutor = await Tutors.findOne({ username: id });
    try {
      const updatedTutor = await Tutors.findOneAndUpdate(
        id, //finding the tutor that you want to edit
        editedProfile,
        { new: true }
      );
      console.log("editedProfile2", editedProfile);
      console.log("updatedTutor", updatedTutor);
      res.status(200).json(updatedTutor);
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "Tutor details could not be updated." });
    }
  }
);

module.exports = router;

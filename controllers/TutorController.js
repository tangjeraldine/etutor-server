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
router.get("/alltutor", async (req, res) => {
  try {
    const { page = 0 } = req.query;
    const PAGE_SIZE = 5;
    const total = await Tutors.countDocuments({});
    const allTutor = await Tutors.find({}, null, {
      skip: parseInt(page) * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort: {
        rating: -1,
      },
    });
    res
      .status(200)
      .send({ totalPages: Math.ceil(total / PAGE_SIZE), allTutor });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Filter tutors by subjects,classType and classLevel, ratings and region
router.get("/alltutor/search/", async (req, res) => {
  const { sortState } = req.params;
  console.log(sortState);
  const { page = 0 } = req.query;
  const PAGE_SIZE = 5;
  const total = await Tutors.countDocuments({});
  let subjects = req.query.subjects.split(",");
  let classType = req.query.classType.split(",");
  let classLevel = req.query.classLevel;
  let region = req.query.region.split(",");
  const filter = {
    subjects: { $all: subjects },
    region: { $all: region },
    classLevel: classLevel,
    classType: { $all: classType },
  };
  if (subjects[0] === "") {
    delete filter.subjects;
  }
  if (classType[0] === "") {
    delete filter.classType;
  }
  if (region[0] === "") {
    delete filter.region;
  }
  if (classLevel === "select level") {
    delete filter.classLevel;
  }
  if (sortState === "Sort") {
    sortState = rating;
  }
  console.log("subjects", subjects);
  console.log("region", region);
  console.log("classLevel", classLevel);
  console.log("classType", classType);
  console.log("sortState", sortState);
  console.log(filter);

  try {
    const filteredTutor = await Tutors.find(filter, null, {
      skip: parseInt(page) * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort: { sortState: 1 },
    }).exec();

    res
      .status(200)
      .send({ totalPages: Math.ceil(total / PAGE_SIZE), filteredTutor });
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
    await Tutors.create(newTutor, (error, tutor) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Tutor profile unable to be set up." });
      } else {
        res.status(200).json(tutor);
      }
    });
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

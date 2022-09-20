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

router.get("/region", async (req, res) => {
  try {
    const sortbyRegion = await Tutors.find({}).sort({ region: 1, rating: 1 });
    console.log(sortbyRegion);
    res.status(200).send(sortbyRegion);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/rating", async (req, res) => {
  try {
    const sortbyRating = await Tutors.find({}).sort({ rating: -1 });
    console.log(sortbyRating);
    res.status(200).send(sortbyRating);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Find all tutor w pagination
router.get("/", async (req, res) => {
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

// Find one tutor by username (mongo ID)
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const tutor = await Tutors.findOne({username: id});
      if (tutor === null) {
        res.status(404).send({error: 'Tutor not found.'})
      } else {
        res.status(200).send(tutor);
      }
    } catch (error) {
      res.status(500).send(error);
      // res.status(401).send({ error: "Tutor details could not be updated." });
    }
  }
);

// Filter tutors by subjects,classType and classLevel
router.get("/search", async (req, res) => {
  let subjects = req.query.subjects.split(",");
  let classType = req.query.classType;
  let classLevel = req.query.classLevel;
  let region = req.query.region.split(",");
  console.log("subjects", subjects);
  console.log("classType", classType);
  console.log("classLevel", classLevel);
  console.log("region", region);
  try {
    const filteredTutor = await Tutors.find(
      {
        subjects: { $all: subjects },
        classType: { $all: classType },
        classLevel: classLevel,
        region: { $all: region },
      },
      null,
      { sort: { rating: -1 } }
    ).exec();

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

router.get("/editprofile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getThisTutor = await Tutors.findOne({ username: id });
    if (getThisTutor === null) {
      res.status(404).send({ error: "Tutor not found." });
    } else {
      res.status(200).send(getThisTutor);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

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

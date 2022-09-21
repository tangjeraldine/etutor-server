const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const TuteeProfileValidation = require("../Validations/TuteeProfileValidation");
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

//userTypeIsTutee middleware
const userTypeIsTutee = async (req, res, next) => {
  const bearer = req.get("Authorization");
  const token = bearer.split(" ")[1];
  try {
    res.locals.payload = jwt.verify(token, SECRET);
    if (res.locals.payload.userTYPE === "tutee") {
      // res.send(res.locals.payload);
      next();
    } else {
      res.status(401).send("You are not authorised to view this page.");
    }
  } catch (error) {
    res.status(401).send({ error });
  }
};

router.put("/acceptPendingTutee", async (req, res) => {
  try {
    res.status(200).send("hello");
  } catch (error) {
    res.status(401).send({ error });
  }
});

router.put("/deleteFavList", async (req, res) => {
  const { username } = req.query;
  const { tutorID } = req.body;
  console.log(tutorID);

  try {
    const deleteTuteeFavList = await Tutees.findOneAndUpdate(
      username,
      { $pull: { favTutors: tutorID } },
      { new: true }
    );
    res.status(200).send(deleteTuteeFavList);
  } catch (error) {
    res.status(401).send({ error: error });
  }
});

// find current tutee logged in and add their fav tutor

router.put("/updateFavList", async (req, res) => {
  const { username } = req.query;
  const tutor = req.body;
  try {
    const updateTuteeFavList = await Tutees.findOneAndUpdate(
      username,
      { $push: { favTutors: tutor } },
      { new: true }
    );
    res.status(200).send(updateTuteeFavList);
  } catch (error) {
    res.status(401).send({ error });
  }
});

// find current tutee logged in and display lists of their tutors
router.get("/myTutors/", async (req, res) => {
  const { username } = req.query;
  try {
    const currentTutee = await Tutees.findOne({
      username: username,
    })
      .populate("favTutors")
      .populate("myTutors")
      .populate("pendingTutors");
    if (currentTutee === null) {
      res.status(404).send({ error: "Tutee not found" });
    } else {
      console.log(currentTutee);
      res.status(200).send(currentTutee);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//* Edit profile get and put requests
router.get("/editprofile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getThisTutee = await Tutees.findOne({ username: id });
    if (getThisTutee === null) {
      res.status(404).send({ error: "Tutee not found." });
    } else {
      res.status(200).send(getThisTutee);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get to tutees page where user can access all their own information
router.get("/", userTypeIsTutee, async (req, res) => {
  try {
    //! Change to find that one tutee's class info by id
    const payload = res.locals.payload;
    const currentTutee = await Tutees.find({ username: payload.username });
    res.status(200).send(currentTutee);
    //! Instead of sending all tutors info, we should be showing that one tutor's calendar information
  } catch (error) {
    res.status(500).send(error);
  }
});

// find all the tutees that have that specific tutor(find a specific tutor's list of tutees)
router.get("/myTutees/:tutorId", async (req, res) => {
  const { tutorId } = req.params;
  console.log(tutorId);
  try {
    const myTutees = await Tutees.find({
      $or: [
        { myTutors: { $all: [tutorId] } },
        { pendingTutors: { $all: [tutorId] } },
      ],
    });
    res.status(200).send(myTutees);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post(
  "/profile-signup",
  validation(TuteeProfileValidation),
  async (req, res) => {
    const newTutee = req.body;
    await Tutees.create(newTutee, (error, tutee) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Tutee profile unable to be set up." });
      } else {
        res.status(200).json(tutee);
      }
    });
  }
);

//* Edit profile get and put requests
router.get("/editprofile/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getThisTutee = await Tutees.findOne({ username: id });
    if (getThisTutee === null) {
      res.status(404).send({ error: "Tutee not found." });
    } else {
      res.status(200).send(getThisTutee);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put(
  "/editprofile/:id",
  validation(TuteeProfileValidation),
  async (req, res) => {
    const { id } = req.params;
    const editedProfile = req.body;
    // console.log("editedProfile1", editedProfile);
    // const showThisTutor = await Tutors.findOne({ username: id });
    try {
      const updatedTutee = await Tutees.findOneAndUpdate(
        { username: id },
        editedProfile,
        {
          new: true,
        }
      );
      // console.log("editedProfile2", editedProfile);
      // console.log("updatedTutee", updatedTutee);
      res.status(200).json(updatedTutee);
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "Tutee details could not be updated." });
    }
  }
);

module.exports = router;

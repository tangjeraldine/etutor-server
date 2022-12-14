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

router.put("/updatetutee/:action/:userid", async (req, res) => {
  const { action, userid } = req.params;
  const tutor = req.body;
  console.log(tutor._id);
  let update = {};
  if (action === "addpending") {
    update = { $push: { pendingTutors: tutor._id } };
  } else if (action === "deletepending") {
    update = { $pull: { pendingTutors: tutor._id } };
  } else if (action === "fav") {
    update = { $push: { favTutors: tutor._id } };
  } else if (action == "unfav") {
    update = { $pull: { favTutors: tutor._id } };
  } else if (action == 'acceptrejecttutee') {
    update = req.body;
  }
  try {
    const updatedTutee = await Tutees.findOneAndUpdate(
      { username: userid },
      update,
      { new: true }
    );
    if (updatedTutee === null) {
      res.status(404).send({ error: "Tutee not found." });
    } else {
      res.status(200).send(updatedTutee);
    }
  } catch (error) {
    res.status(500).send({ error: "Unable to update Tutee." });
  }
});

// find current tutee logged in and display lists of their tutors
//i dont think this is being used? if not using can delete, check w dewei
// router.get("/myTutors/", async (req, res) => {
//   const { username } = req.query;
//   try {
//     const currentTutee = await Tutees.findOne({
//       username: username,
//     })
//       .populate("favTutors")
//       .populate("myTutors")
//       .populate("pendingTutors");
//     if (currentTutee === null) {
//       res.status(404).send({ error: "Tutee not found" });
//     } else {
//       console.log(currentTutee);
//       res.status(200).send(currentTutee);
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// fetch details of current tutee logged in
router.get("/tuteedetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const currentTutee = await Tutees.findOne({
      username: id,
    })
      .populate("favTutors")
      .populate("myTutors")
      .populate("pendingTutors");
    if (currentTutee === null) {
      res.status(404).send({ error: "Tutee not found." });
    } else {
      console.log(currentTutee);
      res.status(200).send(currentTutee);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// find all the tutees that have that specific tutor(find a specific tutor's list of tutees)
router.get("/myTutees/:tutorId", async (req, res) => {
  const { tutorId } = req.params;
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
router.get("/myClasses/:tutorId", async (req, res) => {
  const { tutorId } = req.params;
  console.log(tutorId);
  try {
    const myTutees = await Tutees.find({
      myTutors: { $all: [tutorId] },
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
  console.log(id)
  try {
    const getThisTutee = await Tutees.findOne({ username: id });
    console.log(getThisTutee)
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
    try {
      const updatedTutee = await Tutees.findOneAndUpdate(
        { username: id },
        editedProfile,
        {
          new: true,
        }
      );
      res.status(200).json(updatedTutee);
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "Tutee details could not be updated." });
    }
  }
);

module.exports = router;

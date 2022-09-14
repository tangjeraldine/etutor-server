const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

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

// Get to tutees page where user can access all their own information
router.get("/tutee", userTypeIsTutee, async (req, res) => {
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

router.post("/tutee-signup", async (req, res) => {
  const newTutee = req.body;
  const newUsername = newTutee.username;
  try {
    const thisUsername = await Tutees.find({ newUsername });
    console.log(thisUsername, newUsername);
  } catch (error) {
    console.log(error);
  }
  if (newUsername === "") {
    res.status(400).send({ error: "No username given." });
  } else {
    Tutees.create(newTutee, (error, tutee) => {
      if (error) {
        res.status(500).json({ error: "No input detected" });
      } else {
        res.status(200).json(tutee);
      }
    });
  }
});

// router.get("/tuition", (req, res) => {
//   res.send({ msg: "This is the tutee controller" });
// });

module.exports = router;

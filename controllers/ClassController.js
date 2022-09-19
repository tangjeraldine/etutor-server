require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tutor = require("../models/Tutors");
const Tutee = require("../models/Tutees");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const router = express.Router();
const moment = require("moment");
const bodyParser = require("body-parser");
const SECRET = process.env.SECRET ?? "mysecret";

router.get("/", (req, res) => {
  res.send({ msg: "This is the class controller" });
});

router.use(bodyParser.json());

// router.post("/create-class", async (req, res) => {
//   const newClass = Classes(req.body);
//   await newClass.save();
//   res.sendStatus(201);
// });

// router.get("/get-class", async (req, res) => {
//   const classes = await Classes.find({
//     start: { $gte: moment(req.query.start).toDate() },
//     end: { $lte: moment(req.query.end).toDate() },
//   });
//   res.send(classes);
// });

// router.get("/get-class", async (req, res) => {
//   const classes = await Classes.find({});
//   res.send(classes);
// });



router.get("/get-classes", async (req, res) => {//need to insert middleware for classesvalidation
  try {
    const userId = req.body._id//rn in the database the mongoid for tutors doesnt match the one in classes
    console.log(userId)
    const classes = await Classes.find({tutor: userId});
    res.status(200).send(classes);
  } catch (error) {
    res.status(500).send({ error: 'Unable to load classes.' });
  }
});

module.exports = router;

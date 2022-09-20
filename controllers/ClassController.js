require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Tutor = require("../models/Tutors");
const Tutee = require("../models/Tutees");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const router = express.Router();
const moment = require("moment");
const bodyParser = require("body-parser");
const SECRET = process.env.SECRET ?? "mysecret";
const ClassesValidation = require("../Validations/ClassesValidation");

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

router.get("/get-classes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const classes = await Classes.find({ tutor: id })
      .populate("tutor")
      .populate("bookedBy");
    // .populate('tutor');//need to figure this out. most probably mongo id nesting....
    console.log(classes);
    res.status(200).send(classes);
  } catch (error) {
    res.status(500).send({ error: "Unable to load classes." });
  }
});

router.delete("/remove-class/:id/:tutorId", async (req, res) => {
  try {
    const { id, tutorId } = req.params;
    const deletedClass = await Classes.findOneAndRemove({ _id: id });
    if (deletedClass === null) {
      res.status(404).send({ error: "Class not found." });
    } else {
      const remainingClasses = await Classes.find({ tutor: tutorId });
      res.status(200).send(remainingClasses);
    }
  } catch (error) {
    res.status(500).send({ error: "Unable to delete class." });
  }
});

router.post(
  "/create-class",
  validation(ClassesValidation),
  async (req, res) => {
    const newClass = req.body;
    console.log(newClass);
    await Classes.create(newClass, (error, newClass) => {
      if (error) {
        res.status(500).json({ error: "Unable to create class." });
      } else {
        res.status(200).json(newClass);
      }
    });
  }
);

router.put(
  "/edit-class/:id/:tutorId",
  validation(ClassesValidation),
  async (req, res) => {
    const { id, tutorId } = req.params;
    const editedClass = req.body;
    console.log(editedClass);
    console.log(id, tutorId);
    try {
      const updatedClass = await Classes.findOneAndUpdate(
        { _id: id, tutor: tutorId },
        editedClass,
        {
          new: true,
        }
      );
      if (updatedClass === null) {
        res.status(404).send({ error: "Class not found." });
      } else {
        res.status(200).send(updatedClass);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Unable to edit class." });
    }

    //   newClass, (error, newClass) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).json({ error: "Unable to create class." });
    //   } else {
    //     res.status(200).json(newClass);
    //   }
    // });
  }
);

module.exports = router;

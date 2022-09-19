const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const TutorProfileValidation = require("../Validations/TutorProfileValidation");
const TuteeProfileValidation = require("../Validations/TuteeProfileValidation");
const ClassesValidation = require("../Validations/ClassesValidation");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

//* Middleware for validation
const validation = (schema) => async (req, res, next) => {
  const body = req.body;
  console.log(body);
  try {
    await schema.validate(body);
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// Seed for tutor --> //! seed the tutors first so we can get ObjectID
router.get(
  "/tutor/seed",
  validation(TutorProfileValidation),
  async (req, res) => {
    const newTutors = [
      {
        username: "6326e8b4cd05db0ec29feb49",
        fullName: "Karen Tan Yan Yan",
        phone: 99911199,
        rates: 50,
        rating: 4,
        classType: "In-Person",
        classLevel: ["Primary 1", "Primary 2", "Primary 3"],
        region: "North",
        subjects: ["Mathematics", "Science"],
        educationBackground:
          "NIE Certificate obtained in 2002. I have a Bachelors Degree in Biology and a Masters Degree in Bioinformatics.",
        teachingExperience:
          "Was a primary school teacher at ABC Primary from 2007 to 2018. Became a private tutor after that. I conduct my classes with strictness and students must follow my rules to get good scores. I have a success rate of 80%. This means that 80% of my students get at least band A after attending my classes. ",
        //   myTutees: ["George Lim"],
        //   pendingTutees: [],
      },
      {
        username: "6326e8b4cd05db0ec29feb4b",
        fullName: "Paul Lee",
        phone: 85459999,
        rates: 70,
        rating: 5,
        classType: "In-Person",
        classLevel: ["Primary 5", "Primary 6", "Secondary 1"],
        region: "North",
        subjects: ["Mathematics", "English"],
        educationBackground:
          "I used to study in Raffles Institution and I attended university in the United States. Even though I don't have an NIE qualification, I have a teaching license from the United States.",
        teachingExperience:
          "MOE teacher for 5 years. I like to adopt a more laid back approach to teaching, where I try to make students understand the fundamental principles behind why concepts are the way they are, rather than pure memorisation.",
        //   myTutees: ["Sarah Scofield"],
        //   pendingTutees: ["James Bond"],
      },
      {
        username: "6326e8b4cd05db0ec29feb4a",
        fullName: "John Cena",
        phone: 123456789,
        rates: 100,
        rating: 5,
        classType: "Remote",
        classLevel: ["Primary 5", "Primary 6"],
        region: "North",
        subjects: ["English", "Science"],
        educationBackground:
          "Wrestling and a High School Diploma. My only qualification is my love for English and Science and I guarantee that I can be a good teacher. Take my word for it!",
        teachingExperience:
          "10 years in WWE. I show students cool wrestling moves if they get good grades for their exams. My teaching method is combining studies with exercise, so students can stay fit and smart at the same time! ",
        //   myTutees: ["James Bond"],
        //   pendingTutees: ["Sarah Scofield", "George Lim"],
      },
    ];

    await Tutors.deleteMany();

    try {
      const seedTutors = await Tutors.create(newTutors);
      res.send(seedTutors);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

// Seed Tutees --> //! use objectID from tutors to plug in info for myTutors, pendingTutors & favTutors
router.get(
  "/tutee/seed",
  validation(TuteeProfileValidation),
  async (req, res) => {
    const newTutees = [
      {
        username: "6326e8b4cd05db0ec29feb4d",
        fullName: "George Lim",
        phone: 91919191,
        preferredContactMode: "Phone Call",
        currentLevel: "Primary 3",
        region: "East",
        subjects: ["Science"],
        myTutors: ["6326e8b4cd05db0ec29feb49"], //objectID
        pendingTutors: ["6326e8b4cd05db0ec29feb4b"], //objectID
        favTutors: ["6326e8b4cd05db0ec29feb4a"], //objectID
      },
      {
        username: "6326e8b4cd05db0ec29feb4c",
        fullName: "Sarah Scofield",
        phone: 91119222,
        preferredContactMode: "Email",
        currentLevel: "Secondary 1",
        region: "North",
        subjects: ["Mathematics", "English"],
        myTutors: ["6326e8b4cd05db0ec29feb4b"], //objectID
        pendingTutors: ["6326e8b4cd05db0ec29feb4a"], //objectID
        favTutors: ["6326e8b4cd05db0ec29feb4a"], //objectID
      },
      {
        username: "6326e8b4cd05db0ec29feb4e",
        fullName: "James Bond",
        phone: 90000007,
        preferredContactMode: "WhatsApp Message",
        currentLevel: "Primary 5",
        region: "West",
        subjects: ["English"],
        myTutors: ["6326e8b4cd05db0ec29feb4a"], //objectID
        pendingTutors: ["6326e8b4cd05db0ec29feb4b"], //objectID
        favTutors: ["6326e8b4cd05db0ec29feb4b"], //objectID
      },
    ];

    await Tutees.deleteMany();

    try {
      const seedTutees = await Tutees.create(newTutees);
      res.send(seedTutees);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

// Seed Classes
router.get("/classes/seed", validation(ClassesValidation), async (req, res) => {
  const newClasses = [
    {
      classTitle: "Sec 1 Mathematics by Paul Lee",
      subject: "Mathematics",
      timeDay: "2022-10-17T15:30:00",
      tutor: "6326e8b4cd05db0ec29feb4b",
      bookedBy: ["6326e8b4cd05db0ec29feb4c"],
      groupSize: 5,
    },
    {
      classTitle: "Primary 5 English by John Cena",
      subject: "English",
      timeDay: "2022-10-21T16:00:00",
      tutor: "6326e8b4cd05db0ec29feb4a",
      bookedBy: ["6326e8b4cd05db0ec29feb4e"],
      groupSize: 3,
    },
    {
      classTitle: "Primary 3 Science by Karen Tan",
      subject: "Science",
      timeDay: "2022-11-01T09:30:00",
      tutor: "6326e8b4cd05db0ec29feb49",
      bookedBy: ["6326e8b4cd05db0ec29feb4d"],
      groupSize: 1,
    },
  ];
  await Classes.deleteMany({});

  try {
    const seedClasses = await Classes.insertMany(newClasses);
    res.send(seedClasses);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

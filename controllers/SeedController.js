const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

// Seed for User //! --> use hashing function to hash passwords
router.get("/users/seed", async (req, res) => {
  const users = [
    {
      username: "Karen101",
      password: "iwanttoseeyourmanager",
      userType: "tutor",
    },
    { username: "John", password: "youcantseeme1234", userType: "tutor" },
    { username: "paullee70", password: "ilovejohncena", userType: "tutor" },
    { username: "sarah12", password: "maths4lyfe", userType: "tutee" },
    { username: "George3.14159", password: "lifeofpi", userType: "tutee" },
    { username: "James", password: "bangbang", userType: "tutee" },
  ];
  await User.deleteMany({});
  const result = await User.insertMany(users);
  res.json(result);
});

// Seed for tutor --> //! seed the tutors first so we can get ObjectID
router.get("/tutor/seed", async (req, res) => {
  const newTutors = [
    {
      username: "Karen101",
      fullName: "Karen Tan Yan Yan",
      email: "karentanyy@gmail.com",
      phone: 99911199,
      rates: 50,
      rating: 4,
      classType: "In-Person",
      classLevel: ["Primary 1", "Primary 2", "Primary 3"],
      region: "North",
      subjects: ["Mathematics", "Science"],
      educationBackground: "NIE Certificate",
      teachingExperience:
        "Was a primary school teacher at ABC Primary from 2007 to 2018. Became a private tutor after that.",
      //   myTutees: ["George Lim"],
      //   pendingTutees: [],
    },
    {
      username: "paullee70",
      fullName: "Paul Lee",
      email: "paullee@gmail.com",
      phone: 85459999,
      rates: 70,
      rating: 5,
      classType: "In-Person",
      classLevel: ["Primary 5", "Primary 6", "Seconday 1"],
      region: "North",
      subjects: ["Mathematics", "English"],
      educationBackground: "youtube",
      teachingExperience: "MOE teacher for 5 years",
      //   myTutees: ["Sarah Scofield"],
      //   pendingTutees: ["James Bond"],
    },
    {
      username: "John",
      fullName: "John Cena",
      email: "johncena@gmail.com",
      phone: 123456789,
      rates: 100,
      rating: 5,
      classType: "Remote",
      classLevel: ["Primary 5", "Primary 6"],
      region: "North",
      subjects: ["English", "Science"],
      educationBackground: "Wrestling",
      teachingExperience: "10 years in WWE",
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
});

// Seed Tutees --> //! use objectID from tutors to plug in info for myTutors, pendingTutors & favTutors
router.get("/tutee/seed", async (req, res) => {
  const newTutees = [
    {
      username: "George3.14159",
      fullName: "George Lim",
      email: "iamastudent@gmail.com",
      phone: 91919191,
      preferredContactMode: "Phone",
      currentLevel: "Primary 3",
      region: "East",
      subjects: ["Science"],
      myTutors: ["63217806da256ce678c257a7"], //objectID
      pendingTutors: ["63217806da256ce678c257a9"], //objectID
      favTutors: ["63217806da256ce678c257a8"], //objectID
    },
    {
      username: "sarah12",
      fullName: "Sarah Scofield",
      email: "sarah12@gmail.com",
      phone: 91119222,
      preferredContactMode: "Phone",
      currentLevel: "Secondary 1",
      region: "North",
      subjects: ["Mathematics", "English"],
      myTutors: ["63217806da256ce678c257a8"], //objectID
      pendingTutors: ["63217806da256ce678c257a9"], //objectID
      favTutors: ["63217806da256ce678c257a9"], //objectID
    },
    {
      username: "James",
      fullName: "James Bond",
      email: "007@bond.com",
      phone: 90000007,
      preferredContactMode: "Email",
      currentLevel: "Primary 5",
      region: "West",
      subjects: ["English"],
      myTutors: ["63217806da256ce678c257a9"], //objectID
      pendingTutors: ["63217806da256ce678c257a8"], //objectID
      favTutors: ["63217806da256ce678c257a9"], //objectID
    },
  ];

  await Tutees.deleteMany();

  try {
    const seedTutees = await Tutees.create(newTutees);
    res.send(seedTutees);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Seed Classes
router.get("/classes/seed", async (req, res) => {
  const newClasses = [
    {
      classTitle: "Sec 1 Mathematics by Paul Lee",
      subject: "Mathematics",
      timeDay: "2022-10-17T15:30:00",
      tutor: "63217806da256ce678c257a8",
      bookedBy: ["63217bee785da9102cdb304c"],
      groupSize: 5,
    },
    {
      classTitle: "Primary 5 English by John Cena",
      subject: "English",
      timeDay: "2022-10-21T16:00:00",
      tutor: "63217806da256ce678c257a9",
      bookedBy: ["63217bee785da9102cdb304d"],
      groupSize: 3,
    },
    {
      classTitle: "Primary 3 Science by Karen Tan",
      subject: "Science",
      timeDay: "2022-11-01T09:30:00",
      tutor: "63217806da256ce678c257a7",
      bookedBy: [],
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

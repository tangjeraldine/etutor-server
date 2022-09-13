const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tutor = require("../models/Tutors");
const Tutee = require("../models/Tutees");
const Classes = require("../models/Classes");
const User = require("../models/user");
const Tutors = require("../models/Tutors");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

// Seed for User
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
      myTutees: ["George Lim"],
      pendingTutees: [],
    },
    {
      username: "paullee70",
      fullName: "Paul Lee",
      email: "paullee@gmail.com",
      phone: 85459999,
      rates: 70,
      rating: 5,
      classType: "In-Person",
      classLevel: ["Primary 5", "Primary 6"],
      region: "North",
      subjects: ["Mathematics", "English"],
      educationBackground: "youtube",
      teachingExp: "MOE teacher for 5 years",
      myTutees: ["Sarah Scofield"],
      pendingTutees: ["James Bond"],
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
      teachingExp: "10 years in WWE",
      myTutees: ["James Bond"],
      pendingTutees: ["Sarah Scofield", "George Lim"],
    },
  ];

  await Tutors.deleteMany();

  try {
    const seedTutors = await Tutors.create(newTutors);
    res.send(seedTutors);
  } catch (err) {
    res.status(500).send({ error: "No tutors found!" });
  }
});

module.exports = router;

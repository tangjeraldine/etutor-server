const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const Users = require("../models/Users");
const TutorProfileValidation = require("../Validations/TutorProfileValidation");
const TuteeProfileValidation = require("../Validations/TuteeProfileValidation");
const ClassesValidation = require("../Validations/ClassesValidation");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

// Seed for tutor --> //! seed the tutors first so we can get ObjectID
router.get("/tutor/seed", async (req, res) => {
  const newTutors = [
    {
      username: "63293c37ba44d62447499a05",
      fullName: "Karen Tan Yan Yan",
      phone: 99911199,
      rates: 50,
      rating: 4,
      classType: ["In-Person"],
      classLevel: ["Primary 1", "Primary 2", "Primary 3"],
      region: "North",
      subjects: ["Mathematics", "Science"],
      educationBackground:
        "NIE Certificate obtained in 2002. I have a Bachelors Degree in Biology and a Masters Degree in Bioinformatics.",
      teachingExperience:
        "Was a primary school teacher at ABC Primary from 2007 to 2018. Became a private tutor after that. I conduct my classes with strictness and students must follow my rules to get good scores. I have a success rate of 80%. This means that 80% of my students get at least band A after attending my classes. ",
    },
    {
      username: "63293c37ba44d62447499a07",
      fullName: "Paul Lee",
      phone: 85459999,
      rates: 70,
      rating: 5,
      classType: ["Remote"],
      classLevel: ["Primary 5", "Primary 6", "Secondary 1"],
      region: "North",
      subjects: ["Mathematics", "English"],
      educationBackground:
        "I used to study in Raffles Institution and I attended university in the United States. Even though I don't have an NIE qualification, I have a teaching license from the United States.",
      teachingExperience:
        "MOE teacher for 5 years. I like to adopt a more laid back approach to teaching, where I try to make students understand the fundamental principles behind why concepts are the way they are, rather than pure memorisation.",
    },
    {
      username: "63293c37ba44d62447499a06",
      fullName: "John Cena",
      phone: 123456789,
      rates: 100,
      rating: 5,
      classType: ["Remote", "In-Person"],
      classLevel: ["Primary 5", "Primary 6"],
      region: "North",
      subjects: ["English", "Science"],
      educationBackground:
        "Wrestling and a High School Diploma. My only qualification is my love for English and Science and I guarantee that I can be a good teacher. Take my word for it!",
      teachingExperience:
        "10 years in WWE. I show students cool wrestling moves if they get good grades for their exams. My teaching method is combining studies with exercise, so students can stay fit and smart at the same time! ",
    },
  ];

  await Tutors.deleteMany();

  try {
    const seedTutors = await Tutors.create(newTutors);
    console.log(seedTutors);
    res.send(seedTutors);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Seed Tutees --> //! use objectID from tutors to plug in info for myTutors, pendingTutors & favTutors
router.get("/tutee/seed", async (req, res) => {
  const newTutees = [
    {
      username: "63293c37ba44d62447499a09",
      fullName: "George Lim",
      phone: 91919191,
      preferredContactMode: "Phone Call",
      currentLevel: "Primary 3",
      region: "East",
      subjects: ["Science"],
      myTutors: ["63293de595dbfc0b3d8d8681"], //objectID
      pendingTutors: ["63293de595dbfc0b3d8d8682", "63293de595dbfc0b3d8d8683"], //objectID
      favTutors: ["63293de595dbfc0b3d8d8682"], //objectID
    },
    {
      username: "63293c37ba44d62447499a08",
      fullName: "Sarah Scofield",
      phone: 91119222,
      preferredContactMode: "Email",
      currentLevel: "Secondary 1",
      region: "North",
      subjects: ["Mathematics", "English"],
      myTutors: ["63293de595dbfc0b3d8d8682"], //objectID
      pendingTutors: ["63293de595dbfc0b3d8d8683"], //objectID
      favTutors: ["63293de595dbfc0b3d8d8681", "63293de595dbfc0b3d8d8683"], //objectID
    },
    {
      username: "63293c37ba44d62447499a0a",
      fullName: "James Bond",
      phone: 90000007,
      preferredContactMode: "WhatsApp Message",
      currentLevel: "Primary 5",
      region: "West",
      subjects: ["English"],
      myTutors: ["63293de595dbfc0b3d8d8683"], //objectID
      pendingTutors: ["63293de595dbfc0b3d8d8682"], //objectID
      favTutors: ["63293de595dbfc0b3d8d8682"], //objectID
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
      classType: "Remote",
      classLevel: "Secondary 1",
      subject: "Mathematics",
      timeDay: "2022-10-17T15:30:00",
      tutor: "63293de595dbfc0b3d8d8682",
      bookedBy: ["63293e6941242487952fac4a"],
      groupSize: 5,
    },
    {
      classTitle: "Primary 5 English by John Cena",
      classType: "In-Person",
      classLevel: "Primary 5",
      subject: "English",
      timeDay: "2022-10-21T16:00:00",
      tutor: "63293de595dbfc0b3d8d8683",
      bookedBy: ["63293e6941242487952fac4b"],
      groupSize: 3,
    },
    {
      classTitle: "Primary 3 Science by Karen Tan",
      classType: "In-Person",
      classLevel: "Primary 3",
      subject: "Science",
      timeDay: "2022-11-01T09:30:00",
      tutor: "63293de595dbfc0b3d8d8681",
      bookedBy: ["63293e6941242487952fac49"],
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

// Seed for User //! --> use hashing function to hash passwords
router.get("/users/seed", async (req, res) => {
  const users = [
    {
      username: "Karen101",
      password: bcrypt.hashSync("iw@nttoseeY0U", 10),
      userType: "Tutor",
      email: "karentanyy@gmail.com",
    },
    {
      username: "JohnCeeCee",
      password: bcrypt.hashSync("Youc@ntseeme1234", 10),
      userType: "Tutor",
      email: "johncena@gmail.com",
    },
    {
      username: "paullee70",
      password: bcrypt.hashSync("iLov^JohnCen4", 10),
      userType: "Tutor",
      email: "paullee@gmail.com",
    },
    {
      username: "sarahhh12",
      password: bcrypt.hashSync("mAtHs4lYfE!!", 10),
      userType: "Tutee",
      email: "sarah12@gmail.com",
    },
    {
      username: "George3.14159",
      password: bcrypt.hashSync("Lifeofpi#3142", 10),
      userType: "Tutee",
      email: "iamastudent@gmail.com",
    },
    {
      username: "James",
      password: bcrypt.hashSync("b@@ngb@@ng007", 10),
      userType: "Tutee",
      email: "007@bond.com",
    },
  ];
  await Users.deleteMany({});
  const result = await Users.insertMany(users);
  res.json(result);
});

module.exports = router;

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Classes = require("../models/Classes");
const Tutees = require("../models/Tutees");
const Users = require("../models/Users");
const FAQAbout = require("../models/FAQAbout");
const Tutors = require('../models/Tutors')
const TutorProfileValidation = require("../Validations/TutorProfileValidation");
const TuteeProfileValidation = require("../Validations/TuteeProfileValidation");
const ClassesValidation = require("../Validations/ClassesValidation");
const FAQAboutValidation = require("../Validations/FAQAboutValidation");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

// Seed for tutor --> //! seed the tutors first so we can get ObjectID
router.get("/tutor/seed", async (req, res) => {
  const newTutors = [
    {
      username: "632cb571f84b8d308117808f",
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
      username: "632cb571f84b8d3081178091",
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
      username: "632cb571f84b8d3081178090",
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
      username: "632cb571f84b8d3081178093",
      fullName: "George Lim",
      phone: 91919191,
      preferredContactMode: "Phone Call",
      currentLevel: "Primary 3",
      region: "East",
      subjects: ["Science"],
      myTutors: ["632cb7271ff067463d727945"], //objectID
      pendingTutors: [], //objectID
      favTutors: ["632cb7271ff067463d727945"], //objectID
    },
    {
      username: "632cb571f84b8d3081178092",
      fullName: "Sarah Scofield",
      phone: 91119222,
      preferredContactMode: "Email",
      currentLevel: "Secondary 1",
      region: "North",
      subjects: ["Mathematics", "English"],
      myTutors: ["632cb7271ff067463d727946"], //objectID
      pendingTutors: [], //objectID
      favTutors: ["632cb7271ff067463d727946", "632cb7271ff067463d727947"], //objectID
    },
    {
      username: "632cb571f84b8d3081178094",
      fullName: "James Bond",
      phone: 90000007,
      preferredContactMode: "WhatsApp Message",
      currentLevel: "Primary 5",
      region: "West",
      subjects: ["English"],
      myTutors: ["632cb7271ff067463d727947"], //objectID
      pendingTutors: [], //objectID
      favTutors: ["632cb7271ff067463d727947", '632cb7271ff067463d727945'], //objectID
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
      tutor: "632cb7271ff067463d727946",
      bookedBy: ["632cb7839a891cfafd4f0d2c"],
      groupSize: 5,
    },
    {
      classTitle: "Primary 5 English by John Cena",
      classType: "In-Person",
      classLevel: "Primary 5",
      subject: "English",
      timeDay: "2022-10-21T16:00:00",
      tutor: "632cb7271ff067463d727947",
      bookedBy: ["632cb7839a891cfafd4f0d2d"],
      groupSize: 3,
    },
    {
      classTitle: "Primary 3 Science by Karen Tan",
      classType: "In-Person",
      classLevel: "Primary 3",
      subject: "Science",
      timeDay: "2022-11-01T09:30:00",
      tutor: "632cb7271ff067463d727945",
      bookedBy: ["632cb7839a891cfafd4f0d2b"],
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

router.get("/faq-about/seed", async (req, res) => {
  const newQuestions = [
    {
      question: "What if I encounter technical issues during sign up?",
      answer:
        "You can contact our administrative team on WhatsApp at +65 0000 1111, or email us at etutor-inc@email.com. Please allow us 3 working days to get back to you.",
    },
    {
      question:
        "As a new tutor, how do I get started with listing my services on eTutor?",
      answer:
        "During the sign up process, please indicate under the 'User Type' that you will be using this platform as a tutor.Thereafter, you will need to fill in the required information to build your profile before your listing can be viewed by prospective tutees. Should there be interested tutees who wish to connect with you, you will receive a notification from the tutee. The notification contains the tutee's contact details and preferred contact mode so that you may initiate contact with the tutee and make arrangements if you intend to accept the tutee as your student. Upon acceptance of the tutee on eTutor, you can create available timeslots which the tutee can then view and book accordingly.",
    },

    {
      question: "Can tutors set up group tution bookings on eTutor?",
      answer:
        "Yes, tutors are able to set up booking sessions with either one-to-one or group tuition.",
    },
    {
      question:
        "I am a student looking for a tutor. How can I get started on eTutor?",
      answer:
        "After signing up for a tutee account and filling in the required information for your profile, you may use the search function to search for tutors (you can search by level, subject, region, mode of conducting the tuition session). You will need to notify a prospective tutor with the notification button to make contact with you and provide further details. Once the tutor has accepted you as their tutee, you will be able to view their available time slots and make bookings.",
    },
    {
      question:
        "Is there a physical space provided by ETutor for tutors and tutees to meet and conduct tuition sessions?",
      answer:
        " No, ETutor is only an e-platform for freelance tutors to list their tuition services and for tutees to select tutors of their interest. ETutor does not provide physical classrooms or areas for tuition to be conducted. Arrangements will need to be made privately between each tutor and prospective tutee on how their tuition sessions will be conducted.",
    },
  ];

  await FAQAbout.deleteMany();

  try {
    const seedFAQ = await FAQAbout.create(newQuestions);
    console.log(seedFAQ);
    res.send(seedFAQ);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/faq-about", async (req, res) => {
  try {
    const allquestions = await FAQAbout.find();
    res.status(200).send(allquestions);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

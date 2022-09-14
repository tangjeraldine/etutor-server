const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tutor = require("../models/Tutors");
const Tutee = require("../models/Tutees");
const Classes = require("../models/Classes");
const Tutors = require("../models/Tutors");
const Tutees = require("../models/Tutees");
const router = express.Router();

const SECRET = process.env.SECRET ?? "mysecret";

module.exports = router;

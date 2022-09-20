const mongoose = require("mongoose");

const FAQAboutSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      minlength: [10, "Question needs to contain at least 10 characters."],
      maxlength: [300, "Max length of question is 300 characters."],
      required: true,
    },
    answer: {
      type: String,
      minlength: [10, "Answer needs to contain at least 10 characters."],
      maxlength: [1000, "Max length of answer is 1000 characters."],
      required: true,
    },
  },
  { timestamps: true }
);

const FAQAbout = mongoose.model("FAQAbout", FAQAboutSchema);

module.exports = FAQAbout;

//This schema is for the about page.

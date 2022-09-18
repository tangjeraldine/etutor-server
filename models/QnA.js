const mongoose = require("mongoose");

const QnASchema = new mongoose.Schema(
  {
    topic: { type: string, required: true },
    subject: { type: string, required: true },
    classLevel: { type: string, required: true },
    question: { type: string, required: true },
    comments: { type: [string] },
  },
  { timestamps: true }
);

const QnA = mongoose.model("QnA", QnASchema);

module.exports = QnA;

//student input qn and click "post" --> only tutee can post
// this will create a document in collection
// main page to display all questions (findAll), then sort by subject, class level
// user click on 1 question to go to the question page where they can view or add comments
// When we fetch info from db, we will find by index

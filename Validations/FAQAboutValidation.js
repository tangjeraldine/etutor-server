const yup = require("yup");

const FAQAboutValidation = yup.object({
  question: yup
    .string()
    .min(10, "A minimum of 10 char required.")
    .max(300, "A maximum of 300 char is allowed.")
    .required("A question is required."),
  answer: yup
    .string()
    .min(10, "A minimum of 10 char required.")
    .max(1000, "A maximum of 1000 char is allowed.")
    .required("An answer is required."),
});

module.exports = FAQAboutValidation;

const yup = require("yup");

const TutorProfileValidation = yup.object({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  rates: { type: Number, required: true, min: 0 },
  rating: { type: Number, min: 1, max: 5 },
  classType: { type: String, required: true }, //in-person or remote, or inperson&remote (drop down)
  classLevel: { type: Array, required: true, default: [] }, //pri 1-6, sec 1-5
  region: { type: String, required: true }, //north south east west central
  subjects: { type: Array, required: true, default: [] },
  educationBackground: { type: String, required: true },
  teachingExperience: { type: String, required: true },
});

module.exports = TutorProfileValidation;

//  username: yup
//     .string()
//     .matches(/^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/, {
//       message:
//         "Username should consist of alphanumeric characters, dot, underscore and hyphen (special characters must not be the first or last char and cannot appear consecutively), must be 5-20 characters long.",
//       excludeEmptyString: true,
//     })
//     .required("Username is required."),
//   password: yup
//     .string()
//     .matches(
//       /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/,
//       {
//         message:
//           "Password must not contain any whitespaces, must have at least one uppercase letter, one lowercase character, one digit, one special character, and must be 10-16 characters long.",
//         excludeEmptyString: true,
//       }
//     )
//     .required("Password is required."),
//   userType: yup.string().required("Please select a user type: Tutor or Tutee."),

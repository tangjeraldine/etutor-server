const yup = require("yup");

const TutorProfileValidation = yup.object({
  fullName: yup
    .string()
    .min()
    .matches(/^[a-zA-Z\s]*$/, {
      message: "Name should have at least 4 characters.",
      excludeEmptyString: true,
    })
    .required("A username is required."),
  email: yup.string().email().required("An email address is required."),
  phone: yup
    .number()
    .matches(/^{8}$/, {
      message: "Phone number should be at least 8 digits long.",
      excludeEmptyString: true,
    })
    .required("A username is required."),
  rates: yup
    .number()
    .required("A rate per lesson is required.")
    .min(0, { message: "Rate cannot be less than 0." }),
  rating: yup.number().min(1).max(5),
  classType: yup
    .string()
    .required("Please indicate the mode that the classes are held in."),
  classLevel: yup
    .array()
    .of(yup.string())
    .required("At least one class level is required."), //pri 1-6, sec 1-5
  region: yup.string().required("A region is required."), //north south east west central
  subjects: yup
    .array()
    .of(yup.string())
    .required("At least one subject is required."),
  educationBackground: yup
    .string()
    .required("Information on education background must be given."),
  teachingExperience: yup
    .string()
    .required("Information on teaching experience must be given."),
});

module.exports = TutorProfileValidation;

const yup = require("yup");

const ClassesValidation = yup.object({
  classTitle: yup
    .string()
    .matches(/^[a-zA-Z0-9~!@#$%^&*()_+-=:<>,./|\s]{4,30}$/, {
      message:
        "Class title should have between 4-30 char, and contain only alphabets, numbers and special characters.",
      excludeEmptyString: true,
    })
    .required("Class title is required."),
  classType: yup
    .string()
    .matches(/(In-Person|Remote)/, {
      message: "An appropriate class type is required.",
      excludeEmptyString: true,
    })
    .required("Please indicate the mode that the classes are held in."),
  classLevel: yup
    .string()
    .matches(
      /(Primary 1|Primary 2|Primary 3|Primary 4|Primary 5|Primary 6|Secondary 1|Secondary 2|Secondary 3|Secondary 4|Secondary 5)/,
      {
        message: "Please select a valid class level.",
        excludeEmptyString: true,
      }
    )
    .required("At least one class level is required."),
  subject: yup
    .string()
    .required("Exactly one subject is required.")
    .matches(
      /(English|Mathematics|Science|Additional Mathematics|Elementary Mathematics|Biology|Physics|Chemistry)/,
      {
        message: "Please select one subject.",
        excludeEmptyString: true,
      }
    ),
  timeDay: yup
    .date()
    .default(() => new Date()), //! How to make the date not before today
    // .required("Date and time is required."),
  tutor: yup.string().required("A tutor is required."),
  bookedBy: yup.array().of(yup.string()).default([]),
  groupSize: yup
    .number()
    .positive()
    .integer()
    .required("Group size is required.")
    .min(1, "Group size must be at least 1."),
});

module.exports = ClassesValidation;

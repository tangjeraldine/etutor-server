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
  subjects: yup
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
    .default(() => new Date()) //! How to make the date not before today
    .required("Date and time is required."),
  groupSize: yup.number().positive().integer().required('Group size is required.').min(1, 'Group size must be at least 1.'),
});

module.exports = ClassesValidation;

const yup = require("yup");

const ClassesValidation = yup.object({
  classTitle: yup
    .string()
    .matches(/^[a-zA-Z0-9~!@#$%^&*()_+-=:<>,./|\s]{4,30}$/, {
      message:
        "Class title should have between 4-30 char, and contain only alphabets, numbers and special characters.",
      excludeEmptyString: true,
    })
    .required("A username is required."),
  subjects: yup
    .string()
    .required("Exactly one subject is required.")
    .matches(
      /(English|Mathematics|Science|Additional Mathematics|Elementary Mathematics|Biology|Physics|Chemistry)/,
      {
        message: "Please select at least one subject.",
        excludeEmptyString: true,
      }
    ),
  timeDay: yup
    .date()
    .default(() => new Date())
    .required("A date and time is required."),
  groupSize: yup.number().positive().integer(),
});

module.exports = ClassesValidation;

const yup = require("yup");

const TuteeProfileValidation = yup.object({
  username: yup
  .string()
  .required("Username is required."),
  fullName: yup
    .string()
    .matches(/^[a-zA-Z\s]{4,30}$/, {
      message: "Name should have 4-30 characters, and contain only alphabets.",
      excludeEmptyString: true,
    })
    .required("A username is required."),
  phone: yup
    .string()
    .matches(/^[0-9]{8,20}$/, {
      message: "Phone number should be between 8-20 digits long.",
      excludeEmptyString: true,
    })
    .required("A phone number is required."),
  region: yup
    .string()
    .matches(/(North|South|East|West|Central)/, {
      message: "A region is required.",
      excludeEmptyString: true,
    })
    .required("A region is required."),
  preferredContactMode: yup
    .string()
    .required("Preferred contact mode is required.")
    .matches(/(Phone Call|Email|WhatsApp Message)/, {
      message: "Preferred mode of contact is required.",
      excludeEmptyString: true,
    }),
  currentLevel: yup
    .string()
    .required("A class level is required.")
    .matches(
      /(Primary 1|Primary 2|Primary 3|Primary 4|Primary 5|Primary 6|Secondary 1|Secondary 2|Secondary 3|Secondary 4|Secondary 5)/,
      {
        message: "Input a valid class level.",
        excludeEmptyString: true,
      }
    ),
  subjects: yup
    .array()
    .min(1, "At least one subject is required.")
    .of(yup.string())
    .required("At least one subject is required."),
  // .matches(/(English|Mathematics|Science|Additional Mathematics|Elementary Mathematics|Biology|Physics|Chemistry)/, {
  //   message: "Please select at least one subject.",
  //   excludeEmptyString: true,
  // }),
});

module.exports = TuteeProfileValidation;

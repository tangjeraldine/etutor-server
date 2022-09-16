const yup = require("yup");

const TuteeProfileValidation = yup.object({
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
    .string()
    .matches(/^(+).[0-9]{8,20}$/, {
      message:
        "Phone number should be between 8-20 digits long and contain your country code (e.g. +65 ).",
      excludeEmptyString: true,
    })
    .required("A phone number is required."),
  classLevel: yup
    .string()
    .required("A class level is required.")
    .matches(
      /(Primary 1|Primary 2|Primary 3|Primary 4|Primary 5|Primary 6|Secondary 1|Secondary 2|Secondary 3|Secondary 4|Secondary 5)/,
      {
        message: "Input a valid class level.",
        excludeEmptyString: true,
      }
    ), //pri 1-6, sec 1-5
  region: yup
    .string()
    .matches(/(North|South|East|West)/, {
      message: "A region is required.",
      excludeEmptyString: true,
    })
    .required("A region is required."),
  //north south east west central
  subjects: yup
    .array()
    .of(yup.string())
    .required("At least one subject is required."),
  // .matches(/(English|Mathematics|Science|Additional Mathematics|Elementary Mathematics|Biology|Physics|Chemistry)/, {
  //   message: "Please select at least one subject.",
  //   excludeEmptyString: true,
  // }),
});

module.exports = TuteeProfileValidation;

const yup = require("yup");

const TutorProfileValidation = yup.object({
  fullName: yup
    .string()
    .matches(/^[a-zA-Z\s]{4,30}$/, {
      message:
        "Name should have at least 4 characters, and contain only alphabets.",
      excludeEmptyString: true,
    })
    .required("A username is required."),
  email: yup.string().email('Must be a valid email').required("An email address is required."),
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
  rates: yup
    .number()
    .typeError('Rates must be a number')
    .required("A rate per lesson is required.")
    .min(0, { message: "Rate cannot be less than 0." })
    .max(1000, { message: "Rates cannot be higher than 1000." }),
  rating: yup
    .number()
    .min(1, { message: "Rating cannot be lower than 1." })
    .max(5, { message: "Rating cannot be higher than 5." }),
  classType: yup
    .string()
    .matches(/(In-Person|Remote|Both In-Person and Remote)/, {
      message: "An appropriate class type is required.",
      excludeEmptyString: true,
    })
    .required("Please indicate the mode that the classes are held in."),
  classLevel: yup
    .array()
    .min(1, "At least one class level is required.")
    .of(yup.string())
    .required("At least one class level is required."), //pri 1-6, sec 1-5
  //   .matches(/(Primary 1|Primary 2|Primary 3|Primary 4|Primary 5|Primary 6|Secondary 1|Secondary 2|Secondary 3|Secondary 4|Secondary 5)/, {
  //     message: "Please select a valid class level.",
  //     excludeEmptyString: true,
  //   }),
  subjects: yup
    .array()
    .min(1, "At least one subject is required.")
    .of(yup.string())
    .required("At least one subject is required."),
  // .matches(/(English|Mathematics|Science|Additional Mathematics|Elementary Mathematics|Biology|Physics|Chemistry)/, {
  //   message: "Please select at least one subject.",
  //   excludeEmptyString: true,
  // }),
  educationBackground: yup
    .string()
    .min(50, "A minimum length of 50 char is required.")
    .max(450, "A maximum length of 450 char is allowed.")
    .required("Information on education background must be given."),
  teachingExperience: yup
    .string()
    .min(50, "A minimum length of 50 char is required.")
    .max(450, "A maximum length of 450 char is allowed.")
    .required("Information on teaching experience must be given."),
});

module.exports = TutorProfileValidation;

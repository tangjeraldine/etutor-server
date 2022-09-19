const yup = require("yup");

const SignInValidation = yup.object({
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/, {
      message:
        "Username should consist of alphanumeric characters, dot, underscore and hyphen (special characters must not be the first or last char and cannot appear consecutively), must be 5-20 characters long.",
      excludeEmptyString: true,
    })
    .required("Username is required."),
  password: yup
    .string()
    // .matches(
    //   /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/,
    //   {
    //     message:
    //       "Password must not contain any whitespaces, must have at least one uppercase letter, one lowercase character, one digit, one special character, and must be 10-16 characters long.",
    //     excludeEmptyString: true,
    //   }
    // )
    .required("Password is required."),
});

module.exports = SignInValidation;

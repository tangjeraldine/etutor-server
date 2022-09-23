const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const SignInValidation = require("../Validations/SignInValidation");
const SignUpValidation = require("../Validations/SignUpValidation");
const editUserDetValidation = require("../Validations/editUserDetValidation");
const bcrypt = require("bcrypt");
const router = express.Router();

const SECRET = process.env.SECRET ?? "MaryJerDew";

//* Middleware for validation
const validation = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};

router.post("/signin", validation(SignInValidation), async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username });
  if (user === null) {
    res.status(401).send({ error: "No user." });
  } else if (bcrypt.compareSync(password, user.password)) {
    const payload = { user };
    const token = jwt.sign(payload, SECRET);
    res.status(200).send({ msg: "Successful login", token });
  } else {
    res.status(401).send({ error: "Validation failed." });
  }
});

router.post("/signup", validation(SignUpValidation), async (req, res) => {
  const newUser = req.body;
  const newUsername = newUser.username;
  newUser.password = bcrypt.hashSync(newUser.password, 10);
  const thisUsername = await Users.findOne({ username: newUsername });
  const thisNewEmail = await Users.findOne({ email: newUser.email });
  if (thisUsername === null && thisNewEmail === null) {
    Users.create(newUser, (error, user) => {
      console.log(error);
      if (error) {
        res.status(500).json({ error: "User unable to be created." });
        return
      } else {
        res.status(200).json(user);
        return
      }
    });
  } else {
    if (thisUsername.username === newUsername) {
      res.status(400).send({ error: "This username has been taken." });
      return
    }
    if (thisNewEmail.email === newUser.email) {
      res.status(400).send({ error: "This email address is already in use." });
      return
    }
  }
});

router.get("/viewuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ViewThisUser = await Users.findOne({ _id: id });
    res.status(200).send(ViewThisUser);
  } catch (error) {
    res.status(400).send({ error: "User details cannot be retrieved." });
  }
});

router.put(
  "/edituserdetails/:id",
  validation(editUserDetValidation),
  async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const editedUserDetails = req.body;
    if (editedUserDetails.password === "") {
      if (editedUserDetails.username === "" && editedUserDetails.email === "") {
        res.status(200).send({ message: "No user details were amended." });
      } else if (
        editedUserDetails.username !== "" &&
        editedUserDetails.email === ""
      ) {
        const findUserUsername = await Users.findOne({
          username: editedUserDetails.username,
        });
        if (findUserUsername === null) {
          const updatedUser = await Users.findOneAndUpdate(
            { _id: id },
            {
              username: editedUserDetails.username,
            },
            {
              new: true,
            }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(500).send({
            error:
              "This username is already taken, hence new details were not updated.",
          });
        }
      } else if (
        editedUserDetails.email !== "" &&
        editedUserDetails.username === ""
      ) {
        const findUserEmail = await Users.findOne({
          email: editedUserDetails.email,
        });
        if (findUserEmail === null) {
          const updatedUser = await Users.findOneAndUpdate(
            { _id: id },
            {
              email: editedUserDetails.email,
            },
            {
              new: true,
            }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(500).send({
            error:
              "This email is already taken, hence new details were not updated.",
          });
        }
      } else if (
        editedUserDetails.username !== "" &&
        editedUserDetails.email !== ""
      ) {
        const findUserEmail = await Users.findOne({
          email: editedUserDetails.email,
        });
        const findUserUsername = await Users.findOne({
          username: editedUserDetails.username,
        });
        if (findUserEmail === null && findUserUsername === null) {
          const updatedUser = await Users.findOneAndUpdate(
            { _id: id },
            {
              username: editedUserDetails.username,
              email: editedUserDetails.email,
            },
            {
              new: true,
            }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(500).send({
            error:
              "This username/ email are already taken, hence new details were not updated.",
          });
        }
      }
    } else {
      if (editedUserDetails.username === "" && editedUserDetails.email === "") {
        const updatedUser = await Users.findOneAndUpdate(
          { _id: id },
          {
            password: bcrypt.hashSync(editedUserDetails.password, 10),
          },
          {
            new: true,
          }
        );
        res.status(200).send({ message: "User password has been updated." });
      } else if (editedUserDetails.username !== "") {
        const findUserUsername = await Users.findOne({
          username: editedUserDetails.username,
        });
        if (findUserUsername === null) {
          const updatedUser = await Users.findOneAndUpdate(
            { _id: id },
            {
              username: editedUserDetails.username,
              password: bcrypt.hashSync(editedUserDetails.password, 10),
            },
            {
              new: true,
            }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(500).send({ error: "Username already in use." });
        }
      } else if (editedUserDetails.email !== "") {
        const findUserEmail = await Users.findOne({
          email: editedUserDetails.email,
        });
        if (findUserEmail === null) {
          const updatedUser = await Users.findOneAndUpdate(
            { _id: id },
            {
              email: editedUserDetails.email,
              password: bcrypt.hashSync(editedUserDetails.password, 10),
            },
            {
              new: true,
            }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(500).send({ error: "Email already in use." });
        }
      } else if (
        editedUserDetails.email !== "" &&
        editedUserDetails.username !== ""
      ) {
        const findUserEmail = await Users.findOne({
          email: editedUserDetails.email,
        });
        const findUserUsername = await Users.findOne({
          username: editedUserDetails.username,
        });
        if (findUserEmail === null && findUserUsername === null) {
          const updatedUser = await Users.findOneAndUpdate(
            { _id: id },
            {
              username: editedUserDetails.username,
              email: editedUserDetails.email,
              password: bcrypt.hashSync(editedUserDetails.password, 10),
            },
            {
              new: true,
            }
          );
          res.status(200).json(updatedUser);
        } else {
          res.status(500).send({ error: "Email/Username already in use." });
        }
      }
    }
  }
);

// router.put(
//   "/edituserdetails/:id",
//   validation(editUserDetValidation),
//   async (req, res) => {
//     const { id } = req.params;
//     const editedUserDetails = req.body;
//     // console.log("editedUserDetails1", editedUserDetails);
//     if (editedUserDetails.password === "") {
//       try {
//         const findUserEmail = await Users.findOne({
//           email: editedUserDetails.email,
//         });
//         const findUserUsername = await Users.findOne({
//           username: editedUserDetails.username,
//         });
//         if (findUserEmail === null && findUserUsername === null) {
//           const updatedUser = await Users.findOneAndUpdate(
//             id,
//             {
//               username: editedUserDetails.username,
//               email: editedUserDetails.email,
//             },
//             {
//               new: true,
//             }
//           );
//           res.status(200).json(updatedUser);
//         } else if (findUserEmail !== null) {
//           res.status(401).send({ error: "Email provided is already in use." });
//         } else if (findUserUsername !== null) {
//           res
//             .status(401)
//             .send({ error: "Username provided is already in use." });
//         }
//       } catch (error) {
//         console.log(error);
//         res
//           .status(401)
//           .send({ error: "New user details could not be updated." });
//       }
//     } else {
//       try {
//         const findUserEmail = await Users.findOne({
//           email: editedUserDetails.email,
//         });
//         const findUserUsername = await Users.findOne({
//           username: editedUserDetails.username,
//         });
//         if (findUserEmail === null && findUserUsername === null) {
//           const updatedUser = await Users.findOneAndUpdate(
//             id,
//             {
//               username: editedUserDetails.username,
//               password: bcrypt.hashSync(editedUserDetails.password, 10),
//               email: editedUserDetails.email,
//             },
//             {
//               new: true,
//             }
//           );
//           res.status(200).json(updatedUser);
//         } else if (findUserEmail !== null) {
//           res.status(401).send({ error: "Email provided is already in use." });
//         } else if (findUserUsername !== null) {
//           res
//             .status(401)
//             .send({ error: "Username provided is already in use." });
//         }
//       } catch (error) {
//         console.log(error);
//         res
//           .status(401)
//           .send({ error: "New user details could not be updated." });
//       }
//     }
//   }
// );

module.exports = router;

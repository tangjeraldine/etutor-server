require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const TuteeController = require("./controllers/TuteeController");
const TutorController = require("./controllers/TutorController");
const SeedController = require("./controllers/SeedController");
const UserController = require("./controllers/UserController");
const ClassController = require("./controllers/ClassController");

const PORT = process.env.PORT ?? 3000;
const MONGO_URI =
  "mongodb+srv://jeraldinetyp:sei38-jeraldine@cluster0.apmd9q9.mongodb.net/test?authSource=admin&replicaSet=atlas-7jnjqb-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
const app = express();

mongoose.connect(MONGO_URI);
mongoose.connection.once("open", () => {
  console.log(`I'm connected to MONGOOSE at ${MONGO_URI}`);
});

//* Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/tutor", TutorController);
app.use("/tutee", TuteeController);
app.use("/seed", SeedController);
app.use("/user", UserController);
app.use("/class", ClassController);

//*Index Route
app.get("/", (req, res) => {
  res.send({ msg: "Tuition App!" });
});

//* Listener
app.listen(PORT, () => {
  console.log(`Express listing on ${PORT}`);
});

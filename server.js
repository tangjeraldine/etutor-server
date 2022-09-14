require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcrypt");
const TuitionController = require("./controllers/TuitionController");
const SeedController = require("./controllers/SeedController");

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
app.use("/", TuitionController);
app.use("/", SeedController);

//*Index Route
app.get("/", (req, res) => {
  res.send({ msg: "Tuition App!" });
});

//* Listener
app.listen(PORT, () => {
  console.log(`Express listing on ${PORT}`);
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "./.env") });
const userRoute = require("./routes/userRoute");
const cors = require("cors");

mongoose.set("strictQuery", true);
mongoose
  .connect(`${process.env.Mongo_Url}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRoute);

module.exports = app;

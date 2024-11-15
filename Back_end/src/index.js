require("dotenv").config();
const express = require("express");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const AuthRoute = require("./routes/AuthRoute.js");
const ejs = require("ejs");
const Razorpay = require("razorpay");

const app = express();

app.set("view engine", "ejs");
app.set("views ", "./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.use("/images", express.static("public/images"));

mongoose.set("strictQuery", true);

app.use(express.json());
app.use(cors());

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Initialize MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB is connected..."))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/", route);
app.use("/api", AuthRoute);

app.listen(process.env.PORT || 3001, function () {
  console.log(
    "Express app running on port " + " " + (process.env.PORT || 3001)
  );
});

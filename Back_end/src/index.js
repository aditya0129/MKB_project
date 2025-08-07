// require("dotenv").config();
// const express = require("express");
// const route = require("./routes/route.js");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const AuthRoute = require("./routes/AuthRoute.js");
// const ejs = require("ejs");
// const Razorpay = require("razorpay");

// const app = express();

// app.set("view engine", "ejs");
// app.set("views ", "./views");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({ secret: "secret-key", resave: false, saveUninitialized: true })
// );
// app.use("/images", express.static("public/images"));

// mongoose.set("strictQuery", true);

// app.use(express.json());
// app.use(cors());

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_API_SECRET,
// });

// // Initialize MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB is connected..."))
//   .catch((err) => console.log("MongoDB connection error:", err));

// app.use("/", route);
// app.use("/api", AuthRoute);

// app.listen(process.env.PORT || 3001, function () {
//   console.log(
//     "Express app running on port " + " " + (process.env.PORT || 3001)
//   );
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const ejs = require("ejs");

// Import routes
const route = require("./routes/route");
const AuthRoute = require("./routes/AuthRoute");

// Import MongoDB connection
const connectDB = require("./config/db");

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Set view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Correct path

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Static file serving (images)
app.use("/images", express.static("public/images"));

// Routes
app.use("/", route);
app.use("/api", AuthRoute);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Express app running on port ${PORT}`);
});

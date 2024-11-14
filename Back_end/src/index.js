/* require("dotenv").config();
const express = require("express");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const AuthRoute=require('./routes/AuthRoute.js')
const ejs = require('ejs')
const Razorpay=require("razorpay")

const app = express();

app.set('view engine','ejs')
app.set('views ','./views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.use("/images",express.static("public/images"))

mongoose.set("strictQuery", true);

app.use(express.json());
app.use(cors());

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
}); 

mongoose
  .connect(
    "mongodb+srv://AdityaDB:Addy0129@project1.jxlvbi5.mongodb.net/Man_Ki_Baat-DB?retryWrites=true&w=majority&appName=project1",
    // {
    //   useNewUrlParser: true,          
    // }
  )
  .then(() => console.log("MongoDB is connected..."))
  .catch((err) => console.log(err));

app.use("/", route);
app.use("/api",AuthRoute)

app.listen(process.env.PORT || 3001, function () {
  console.log(
    "Express app running on port " + " " + (process.env.PORT || 3001)
  );
});

 */

// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// Import routes
const route = require("./routes/route.js");
const AuthRoute = require('./routes/AuthRoute.js');

// Initialize Express app
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key', // Store session secret in .env
  resave: false,
  saveUninitialized: true
}));

// Serve static files from public/images
app.use("/images", express.static("public/images"));

// Configure CORS to allow requests from your frontend origin
app.use(cors({
  origin: 'http://82.112.234.209:3000', // Replace with your frontend origin
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// Initialize MongoDB connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://AdityaDB:Addy0129@project1.jxlvbi5.mongodb.net/Man_Ki_Baat-DB?retryWrites=true&w=majority&appName=project1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB is connected..."))
  .catch((err) => console.log("MongoDB connection error:", err));

// Mount routes
app.use("/", route);
app.use("/api", AuthRoute);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
});


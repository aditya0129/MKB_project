require('dotenv').config();
const express = require("express");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const app = express();

mongoose.set("strictQuery", true);

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://AdityaDB:Addy0129@project1.jxlvbi5.mongodb.net/Man_Ki_Baat-DB?retryWrites=true&w=majority&appName=project1",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB is connected..."))

  app.use("/",route);


  app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + " " + (process.env.PORT || 3000));
  });
    

  
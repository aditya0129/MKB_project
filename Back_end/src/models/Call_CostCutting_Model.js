const mongoose = require("mongoose");


const callSchema = new mongoose.Schema({

    callerId: String,
    calleeId: String,
    startTime: Date,
    endTime: Date,
    duration: Number,
    totalCost: Number,
    
  },{timestamps:true});
  
  

  module.exports = mongoose.model('Call_Data', callSchema);
const mongoose = require("mongoose");



const advisorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  Phone_number:{type:Number, required:true},

  email: { type: String, required: true },

  password:{ type:String,required:true},

  expertise: { type: String, required: true },

  profile_description: { type: String },

  profile_picture: { type: String },

  availability_schedule: { type: String},//Schema.Types.Mixed ,

  payment_info: { type: String },

  rating: { type: Number },

  created_at: { type: Date, default: Date.now },

  updated_at: { type: Date, default: Date.now },

},{timestamps:true});

module.exports=mongoose.model("Advisor",advisorSchema)

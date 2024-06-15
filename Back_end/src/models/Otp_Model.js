const mongoose=require('mongoose');

// for forget password using Nodemailer

const Otp_schema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'UserData'
    },
    otp:{
        type:String,
        required:true
    },
    otpExpiration:{
        type:Date,
        default:Date.now,
        get: (otpExpiration) => otpExpiration.getTime(),
        set:(otpExpiration)=> new Date(otpExpiration)
    }

    
},{timestamps:true});

module.exports=mongoose.model("Otp_Data",Otp_schema)
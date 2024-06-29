const mongoose=require('mongoose');

// for forget password using Nodemailer

const Otp_schema=new mongoose.Schema({
    // user_id:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true,
    //     ref:'UserData'
    // },
    email:{
        type : String,
        required:true

    },
    otp:{
        type:String,
        required:true
    },
    timestamps:{
        type:Date,
        default:Date.now,
        get: (otpExpiration) => otpExpiration.getTime(),
        set:(otpExpiration)=> new Date(otpExpiration)
    }

    
});

module.exports=mongoose.model("Otp_Data",Otp_schema)
const mongoose=require('mongoose');


const otpschema=new mongoose.Schema({
    number:{
        type:String,
        required:true
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

module.exports=mongoose.model("Otp",otpschema)
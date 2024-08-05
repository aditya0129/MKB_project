const express =require('express');
const router= express()

router.use(express.json());


const bodyParser=require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));


const {mailVerification,reset_password ,Update_password,resetSuccess}=require('../Controllers/UserControllers')
//const { forgotPassword, resetPassword } = require('../Controllers/UserControllers');


 
router.get('/api/mail-verification',mailVerification)

router.get('/api/reset-Password',reset_password)
router.post('/api/reset-Password',Update_password)
router.get('/api/reset-success',resetSuccess)
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

module.exports=router;
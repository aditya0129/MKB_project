const express =require('express');
const router= express()

router.use(express.json());

const {mailVerification}=require('../Controllers/UserControllers')
//const { forgotPassword, resetPassword } = require('../Controllers/UserControllers');


 
router.get('/api/mail-verification',mailVerification)

// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

module.exports=router;
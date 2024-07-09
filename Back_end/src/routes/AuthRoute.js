const express =require('express');
const router= express()

router.use(express.json());

const {mailVerification}=require('../Controllers/UserControllers')


 
router.get('/api/mail-verification',mailVerification)

module.exports=router;
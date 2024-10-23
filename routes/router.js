const express = require("express");
const {sendEnrollEmail,sendmail} = require("../controller/mailcontroller");
const {registerUser,getUserData,deleteUser,loginUser,getUserOne}= require("../controller/inquarycontroller");
const forgetPassword = require("../controller/forgetpasswrod");
const adminLogin = require("../controller/adminlogin")
const uploadImage = require("../controller/imageController")
const router = express.Router();
router.post("/mailregister",sendmail);
router.post("/enrollregister",sendEnrollEmail);
router.post("/newuser",registerUser); 
router.get("/getuser",getUserData);
router.post("/getuserone",getUserOne)
router.delete("/deleteUser/:id",deleteUser)
router.post("/login",loginUser);
router.post("/forgetpassword",forgetPassword);
router.post("/adminlogin",adminLogin)

router.post('/uploads',uploadImage);
module.exports = router;
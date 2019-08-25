const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check} = require('express-validator');


router.get("/users/signup", userController.signUpForm);

router.post("/users/signup", 
[
    //username must be an email
    check('email').isEmail(),
    // password must be at least 6 chars long
    check('password').isLength({min:6}),
    // password confirmation must match password
    check('passwordConfirmation').optional().matches('password')
], userController.create);

module.exports = router;
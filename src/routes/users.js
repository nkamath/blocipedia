const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check} = require('express-validator');


router.get("/users/sign-up", userController.signUpForm);

router.post("/users/sign-up", 
[
    //username must be an email
    check('email').isEmail(),
    // password must be at least 6 chars long
    check('password').isLength({min:6}),
    // password confirmation must match password
    check('passwordConfirmation').optional().matches('password')
], userController.create);

router.get("/users/sign-in", userController.signInForm);
router.post("/users/sign-in", [
    //username must be an email
    check('email').isEmail(),
    // password must be at least 6 chars long
    check('password').isLength({min:6}),
    // password confirmation must match password
    check('passwordConfirmation').optional().matches('password')
], userController.signIn);
router.get("/users/sign_out", userController.signOut);

module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users/signup", userController.signUpForm);
router.post("/users/signup", userController.signUp);

module.exports = router;
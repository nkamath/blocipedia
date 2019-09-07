const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController.js");

router.get("/premium", paymentController.upgrade);
router.post("/premium/:id/upgrade", paymentController.payment);
router.post("/premium/:id/downgrade", paymentController.downgrade);

module.exports = router;

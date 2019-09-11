const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const { check} = require('express-validator');


router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", wikiController.edit);

router.post("/wikis/new", wikiController.create);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.post("/wikis/:id/update", wikiController.update);

router.get("/wikis/:id/share", wikiController.share);
router.post("/wikis/:id/share", wikiController.updateShare);

module.exports = router;
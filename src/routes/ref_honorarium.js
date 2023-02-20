const express = require("express");
const router = express.Router();
const { honorariumnested } = require("../controllers/ref_honorarium");

router.get("/honorariumnested/", honorariumnested);

module.exports = router;

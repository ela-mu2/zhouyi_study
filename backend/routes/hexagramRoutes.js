const express = require("express");
const router = express.Router();
const hexagramController = require("../controllers/hexagramController");

router.get("/", hexagramController.getAllHexagrams);

module.exports = router;

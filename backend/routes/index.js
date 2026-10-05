const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes")
const quizRoutes = require("./quizRoutes");
const hexagramRoutes = require("./hexagramRoutes");
const articleRoutes = require("./articleRoutes");

router.use("/user", userRoutes);
router.use("/quizzes", quizRoutes);
router.use("/hexagrams", hexagramRoutes);
router.use("/articles", articleRoutes);

module.exports = router;

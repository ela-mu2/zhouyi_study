const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const quizRoutes = require("./quizRoutes");
const hexagramRoutes = require("./hexagramRoutes");
const articleRoutes = require("./articleRoutes");

router.use("/auth", authRoutes);
router.use("/quizzes", quizRoutes);
router.use("/hexagrams", hexagramRoutes);
router.use("/articles", articleRoutes);

module.exports = router;

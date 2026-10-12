const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/quizzes", require("./quizRoutes"));
router.use("/hexagrams", require("./hexagramRoutes"));
router.use("/articles", require("./articleRoutes"));

module.exports = router;

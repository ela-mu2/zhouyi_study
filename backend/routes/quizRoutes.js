const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/attempt", authMiddleware, quizController.submitAttempt);
router.post("/", quizController.createQuiz);

module.exports = router;

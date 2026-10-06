const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const auth = require("../middlewares/auth")

router.get("/", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);
router.post("/attempt", auth.authenticate, quizController.submitAttempt);
router.post("/", quizController.createQuiz);

module.exports = router;

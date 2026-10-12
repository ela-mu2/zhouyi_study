const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const auth = require("../middlewares/auth");

router.get("/", quizController.getAllQuizzes);
router.get("/attempts", auth.authenticate, quizController.getMyAttempts);
router.post("/attempt", auth.authenticate, quizController.submitAttempt);
router.get("/:id", quizController.getQuizById);
router.post("/", quizController.createQuiz);

module.exports = router;

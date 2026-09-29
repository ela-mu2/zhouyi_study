const mongoose = require("mongoose");

const userQuizAttemptSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quiz_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
        },
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        selected_option_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        is_correct: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("UserQuizAttempt", userQuizAttemptSchema);


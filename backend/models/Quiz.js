const mongoose = require("mongoose");
const optionSchema = new mongoose.Schema({
  option_text: { type: String, required: true, trim: true },
  is_correct: { type: Boolean, default: false },
});
const questionSchema = new mongoose.Schema({
  question_text: { type: String, required: true, trim: true },
  options: { type: [optionSchema], validate: (items) => items.length >= 2 },
});
const quizSchema = new mongoose.Schema({
  category_title: { type: String, required: true, trim: true },
  category_description: { type: String, default: "" },
  questions: { type: [questionSchema], default: [] },
}, { timestamps: true });
module.exports = mongoose.model("Quiz", quizSchema);

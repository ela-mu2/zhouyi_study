const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    category: String,
    inStock: {
        type: Boolean,
        default: true,
    },
    imageUrl: {
        type: String,
    },
});

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;

const mongoose = require("mongoose");

// 1. Users Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: Number, default: 0 }, // 0: 普通用户, 1: 管理员
    created_at: { type: Date, default: Date.now },
});

// 2. Hexagrams Schema
const hexagramSchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: String,
    description: String,
});

// 3. Articles Schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

// 4. Quizzes Schema (整合了 quiz_categories + quiz_questions + quiz_options)
const optionSchema = new mongoose.Schema({
    option_text: { type: String, required: true },
    is_correct: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    options: [optionSchema], // 嵌套选项数组
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // 对应 quiz_categories 的 title
    description: String, // 对应 quiz_categories 的 description
    questions: [questionSchema], // 嵌套题目数组
});

// 5. UserQuizAttempts Schema
const userQuizAttemptSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    selected_option_id: { type: mongoose.Schema.Types.ObjectId },
    is_correct: { type: Boolean, required: true },
    created_at: { type: Date, default: Date.now },
});

// 导出 Models
module.exports = {
    User: mongoose.model("User", userSchema),
    Hexagram: mongoose.model("Hexagram", hexagramSchema),
    Article: mongoose.model("Article", articleSchema),
    Quiz: mongoose.model("Quiz", quizSchema),
    UserQuizAttempt: mongoose.model("UserQuizAttempt", userQuizAttemptSchema),
};

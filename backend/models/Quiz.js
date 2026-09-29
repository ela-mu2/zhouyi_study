const mongoose = require("mongoose");

// 1. 选项 Schema（嵌套在题目中）
const optionSchema = new mongoose.Schema({
    option_text: {
        type: String,
        required: true,
        trim: true,
    },
    is_correct: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// 2. 题目 Schema（嵌套在测验分类中）
const questionSchema = new mongoose.Schema({
    question_text: {
        type: String,
        required: true,
        trim: true,
    },
    options: [optionSchema], // 嵌套选项数组
});

// 3. 测验/分类 主 Schema（核心三合一）
const quizSchema = new mongoose.Schema(
    {
        category_title: {
            type: String,
            required: true,
            trim: true,
        },
        category_description: {
            type: String,
            default: "",
        },
        questions: [questionSchema], // 嵌套题目数组
    },
    {
        timestamps: true, // 自动添加 createdAt 和 updatedAt
    },
);

module.exports = mongoose.model("Quiz", quizSchema);

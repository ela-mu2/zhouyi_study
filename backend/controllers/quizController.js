const Quiz = require("../models/Quiz");
const UserQuizAttempt = require("../models/UserQuizAttempt");

// 获取所有测验分类（含题目与选项）
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "获取测验失败", error: error.message });
    }
};

// 根据 ID 获取单个测验
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "未找到该测验" });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: "获取测验失败", error: error.message });
    }
};

// 提交答题记录
exports.submitAttempt = async (req, res) => {
    try {
        const { quiz_id, question_id, selected_option_id, is_correct } = req.body;
        const user_id = req.user.userId; // 来源于 authMiddleware 的解析

        const attempt = await UserQuizAttempt.create({
            user_id,
            quiz_id,
            question_id,
            selected_option_id,
            is_correct,
        });

        res.status(201).json({ message: "记录提交成功", attempt });
    } catch (error) {
        res.status(500).json({ message: "提交失败", error: error.message });
    }
};

// 创建测验（测试用）
exports.createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ message: "测验创建成功", quiz });
    } catch (error) {
        res.status(500).json({ message: "创建失败", error: error.message });
    }
};

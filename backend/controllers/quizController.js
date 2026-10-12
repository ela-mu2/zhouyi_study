const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const UserQuizAttempt = require("../models/UserQuizAttempt");

exports.getAllQuizzes = async (_req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "获取测验失败", error: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "未找到该测验" });
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: "测验 ID 无效", error: error.message });
    }
};

exports.submitAttempt = async (req, res) => {
    try {
        const { quiz_id, answers, attempt_group_id } = req.body;
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: "答题内容不能为空" });
        }
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) return res.status(404).json({ message: "未找到该测验" });

        const records = [];
        for (const answer of answers) {
            const question = quiz.questions.id(answer.question_id);
            const option = question?.options.id(answer.selected_option_id);
            if (!question || !option) {
                return res.status(400).json({ message: "题目或选项不属于此测验" });
            }
            records.push({
                user_id: req.user._id,
                quiz_id: quiz._id,
                question_id: question._id,
                selected_option_id: option._id,
                is_correct: option.is_correct,
                attempt_group_id: String(attempt_group_id || new mongoose.Types.ObjectId()),
            });
        }

        const saved = await UserQuizAttempt.insertMany(records);
        res.status(201).json({
            attempt_group_id: records[0].attempt_group_id,
            total: saved.length,
            score: saved.filter((record) => record.is_correct).length,
        });
    } catch (error) {
        res.status(500).json({ message: "提交失败", error: error.message });
    }
};

exports.getMyAttempts = async (req, res) => {
    try {
        const records = await UserQuizAttempt.find({ user_id: req.user._id })
            .sort({ createdAt: -1 })
            .populate("quiz_id", "category_title")
            .lean();
        const grouped = new Map();
        for (const record of records) {
            const groupId = record.attempt_group_id || String(record._id);
            if (!grouped.has(groupId)) {
                grouped.set(groupId, {
                    id: groupId,
                    quizTitle: record.quiz_id?.category_title || "周易测验",
                    total: 0,
                    score: 0,
                    completedAt: record.createdAt,
                });
            }
            const entry = grouped.get(groupId);
            entry.total += 1;
            if (record.is_correct) entry.score += 1;
            if (record.createdAt > entry.completedAt) entry.completedAt = record.createdAt;
        }
        res.json(Array.from(grouped.values()));
    } catch (error) {
        res.status(500).json({ message: "获取答题记录失败", error: error.message });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.status(201).json({ message: "测验创建成功", quiz });
    } catch (error) {
        res.status(400).json({ message: "创建失败", error: error.message });
    }
};

const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const UserQuizAttempt = require("../models/UserQuizAttempt");

exports.getAll = async (_req, res) => {
    try {
        const items = await Quiz.find().sort({ createdAt: -1 });
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: "测验读取失败", error: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const item = await Quiz.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "没有找到这套测验" });
        return res.json(item);
    } catch (error) {
        return res.status(400).json({ message: "测验 ID 无效", error: error.message });
    }
};

exports.submit = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "没有找到这套测验" });
        if (!Array.isArray(req.body.answers) || req.body.answers.length !== quiz.questions.length) {
            return res.status(400).json({ message: "请回答全部题目" });
        }

        let score = 0;
        const records = [];
        const attemptId = String(req.body.attemptId || new mongoose.Types.ObjectId());
        for (const answer of req.body.answers) {
            const question = quiz.questions.id(answer.questionId);
            const option = question?.options.id(answer.optionId);
            if (!question || !option) {
                return res.status(400).json({ message: "题目或选项无效" });
            }
            if (option.is_correct) score += 1;
            if (req.user) {
                records.push({
                    user_id: req.user._id,
                    quiz_id: quiz._id,
                    question_id: question._id,
                    selected_option_id: option._id,
                    is_correct: option.is_correct,
                    attempt_group_id: attemptId,
                });
            }
        }
        if (records.length) await UserQuizAttempt.insertMany(records);
        return res.json({ score, total: quiz.questions.length });
    } catch (error) {
        return res.status(500).json({ message: "提交测验失败", error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const rows = await UserQuizAttempt.find({ user_id: req.user._id }).sort({ createdAt: -1 }).populate("quiz_id", "category_title").lean();
        const groups = new Map();
        for (const row of rows) {
            const id = row.attempt_group_id || String(row._id);
            if (!groups.has(id)) {
                groups.set(id, {
                    id,
                    quizTitle: row.quiz_id?.category_title || "周易测验",
                    score: 0,
                    total: 0,
                    completedAt: row.createdAt,
                });
            }
            const item = groups.get(id);
            item.total += 1;
            if (row.is_correct) item.score += 1;
        }
        return res.json(Array.from(groups.values()));
    } catch (error) {
        return res.status(500).json({ message: "答题记录读取失败", error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const item = await Quiz.create(req.body);
        return res.status(201).json({ message: "测验已添加", item });
    } catch (error) {
        return res.status(400).json({ message: "测验添加失败", error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: "没有找到这套测验" });
        return res.json({ message: "测验已更新", item });
    } catch (error) {
        return res.status(400).json({ message: "测验更新失败", error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const item = await Quiz.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "没有找到这套测验" });
        return res.json({ message: "测验已删除" });
    } catch (error) {
        return res.status(400).json({ message: "测验删除失败", error: error.message });
    }
};

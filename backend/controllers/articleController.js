const Article = require("../models/Article");

exports.getAllArticles = async (_req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: "获取文章失败", error: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "未找到该文章" });
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: "文章 ID 无效", error: error.message });
    }
};

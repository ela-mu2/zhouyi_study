const Article = require("../models/Article");

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: "获取文章失败", error: error.message });
    }
};

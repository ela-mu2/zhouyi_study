const Article = require("../models/Article");

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    const word = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    if (word) {
      const search = new RegExp(word, "i");
      filter.$or = [
        { title: search }, { summary: search }, { content: search }, { category: search },
      ];
    }
    if (category) filter.category = category;
    const items = await Article.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "文章读取失败", error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Article.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "没有找到这篇文章" });
    return res.json(item);
  } catch (error) {
    return res.status(400).json({ message: "文章 ID 无效", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await Article.create(req.body);
    return res.status(201).json({ message: "文章已添加", item });
  } catch (error) {
    return res.status(400).json({ message: "文章添加失败", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "没有找到这篇文章" });
    return res.json({ message: "文章已更新", item });
  } catch (error) {
    return res.status(400).json({ message: "文章更新失败", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Article.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "没有找到这篇文章" });
    return res.json({ message: "文章已删除" });
  } catch (error) {
    return res.status(400).json({ message: "文章删除失败", error: error.message });
  }
};

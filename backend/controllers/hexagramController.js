const Hexagram = require("../models/Hexagram");

exports.getAll = async (req, res) => {
    try {
        const filter = {};
        const word = String(req.query.q || "").trim();
        const category = String(req.query.category || "").trim();
        if (word) {
            const search = new RegExp(word, "i");
            filter.$or = [{ name: search }, { upperTrigram: search }, { lowerTrigram: search }, { category: search }, { modernMeaning: search }, { description: search }];
        }
        if (category) filter.category = category;
        const items = await Hexagram.find(filter).sort({ number: 1 });
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: "卦象读取失败", error: error.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const item = await Hexagram.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "没有找到这个卦象" });
        return res.json(item);
    } catch (error) {
        return res.status(400).json({ message: "卦象 ID 无效", error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const item = await Hexagram.create(req.body);
        return res.status(201).json({ message: "卦象已添加", item });
    } catch (error) {
        return res.status(400).json({ message: "卦象添加失败", error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await Hexagram.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ message: "没有找到这个卦象" });
        return res.json({ message: "卦象已更新", item });
    } catch (error) {
        return res.status(400).json({ message: "卦象更新失败", error: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const item = await Hexagram.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: "没有找到这个卦象" });
        return res.json({ message: "卦象已删除" });
    } catch (error) {
        return res.status(400).json({ message: "卦象删除失败", error: error.message });
    }
};

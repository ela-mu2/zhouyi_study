const Hexagram = require("../models/Hexagrams");

exports.getAllHexagrams = async (req, res) => {
    try {
        const hexagrams = await Hexagram.find();
        res.json(hexagrams);
    } catch (error) {
        res.status(500).json({ message: "获取卦象失败", error: error.message });
    }
};

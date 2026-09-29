const mongoose = require("mongoose");

const hexagramSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, // 如 "乾为天"
    symbol: {
        type: String,
        required: true,
    }, // 如 "䷀"
    description: {
        type: String,
        required: true,
    }, // 卦辞/说明
});

module.exports = mongoose.model("Hexagram", hexagramSchema);

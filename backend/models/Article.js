const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            default: "周易基础",
            trim: true,
        },
        summary: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
);
module.exports = mongoose.model("Article", articleSchema);

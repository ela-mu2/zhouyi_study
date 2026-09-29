const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password_hash: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            default: 0,
        }, // 0: 普通用户, 1: 管理员
    },
    { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

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
        displayName: {
            type: String,
            default: "",
        },
        role: {
            type: Number,
            default: 0,
        },
        favoriteHexagrams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hexagram",
            },
        ],
    },
    { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);

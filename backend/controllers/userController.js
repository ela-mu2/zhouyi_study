const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function getJwtSecret() {
    return process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
}

exports.register = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = req.body.password;
        if (!email || typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ message: "请输入有效邮箱和至少 8 位密码" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "邮箱已被注册" });

        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password_hash });
        res.status(201).json({ message: "注册成功", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "服务器错误", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = req.body.password;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "用户不存在" });

        const isMatch = await bcrypt.compare(password || "", user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "邮箱或密码错误" });

        const secret = getJwtSecret();
        if (!secret) return res.status(500).json({ message: "服务端认证配置缺失" });
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            secret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
        );

        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "服务器错误", error: error.message });
    }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Hexagram = require("../models/Hexagram");

function publicUser(user) {
    return { id: user._id, email: user.email, displayName: user.displayName, role: user.role };
}

exports.register = async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();
        const password = req.body.password;
        if (!email || typeof password !== "string" || password.length < 8) {
            return res.status(400).json({ message: "请输入有效邮箱和至少 8 位密码" });
        }
        if (await User.findOne({ email })) {
            return res.status(409).json({ message: "邮箱已被注册" });
        }
        const password_hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password_hash });
        return res.status(201).json({ message: "注册成功", user: publicUser(user) });
    } catch (error) {
        return res.status(500).json({ message: "注册失败", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const email = String(req.body.email || "")
            .trim()
            .toLowerCase();
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(req.body.password || "", user.password_hash))) {
            return res.status(401).json({ message: "邮箱或密码错误" });
        }
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "服务器认证配置缺失" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });
        return res.json({ token, user: publicUser(user) });
    } catch (error) {
        return res.status(500).json({ message: "登录失败", error: error.message });
    }
};

exports.getProfile = async (req, res) => res.json(publicUser(req.user));

exports.updateProfile = async (req, res) => {
    try {
        const displayName = String(req.body.displayName || "").trim();
        if (displayName.length > 40) {
            return res.status(400).json({ message: "昵称不能超过 40 个字" });
        }
        req.user.displayName = displayName;
        await req.user.save();
        return res.json({ message: "资料已保存", user: publicUser(req.user) });
    } catch (error) {
        return res.status(500).json({ message: "资料保存失败", error: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const items = await Hexagram.find({
            _id: { $in: req.user.favoriteHexagrams },
        }).sort({ number: 1 });
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: "收藏读取失败", error: error.message });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const item = await Hexagram.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "没有找到这个卦象" });
        await User.updateOne({ _id: req.user._id }, { $addToSet: { favoriteHexagrams: item._id } });
        return res.json({ message: "已加入收藏" });
    } catch (error) {
        return res.status(400).json({ message: "收藏失败", error: error.message });
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        await User.updateOne({ _id: req.user._id }, { $pull: { favoriteHexagrams: req.params.id } });
        return res.json({ message: "已取消收藏" });
    } catch (error) {
        return res.status(400).json({ message: "取消收藏失败", error: error.message });
    }
};

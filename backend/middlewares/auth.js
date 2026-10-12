const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
        if (!tokenMatch) return res.status(401).json({ error: "需要登录后继续" });

        const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
        if (!secret) return res.status(500).json({ error: "服务端认证配置缺失" });
        const decoded = jwt.verify(tokenMatch[1], secret);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ error: "登录状态已失效，请重新登录" });

        req.user = user;
        next();
    } catch (_error) {
        res.status(401).json({ error: "登录状态无效或已过期，请重新登录" });
    }
};

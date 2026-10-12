const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return res.status(401).json({ message: "请先登录" });
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ message: "服务器认证配置缺失" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(data.userId);
    if (!user) return res.status(401).json({ message: "登录状态已失效" });
    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "登录状态无效或已过期" });
  }
}

function optionalAuth(req, res, next) {
  if (!req.headers.authorization) return next();
  return authenticate(req, res, next);
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 1) {
    return res.status(403).json({ message: "只有管理员可以管理内容" });
  }
  return next();
}

module.exports = { authenticate, optionalAuth, requireAdmin };

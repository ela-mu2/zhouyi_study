require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/", routes);
app.use((req, res) => res.status(404).json({ message: "没有找到这个接口" }));
app.use((error, _req, res, _next) => {
    console.error(error.message);
    return res.status(500).json({ message: "服务器发生错误" });
});

async function startServer() {
    if (!process.env.MONGODB_URI) throw new Error("请在 .env 文件中设置 MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
    const port = Number(process.env.PORT) || 3000;
    return app.listen(port, () => console.log(`服务器已启动：http://localhost:${port}`));
}

if (require.main === module) {
    startServer().catch((error) => {
        console.error("服务器启动失败：", error.message);
        process.exitCode = 1;
    });
}

module.exports = { app, startServer };

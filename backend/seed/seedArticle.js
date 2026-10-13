require("dotenv").config();

const mongoose = require("mongoose");
const Article = require("../models/Article");

const articles = [
    {
        title: "周易是什么？",
        category: "入门基础",
        summary: "认识《周易》的基本内容和学习方式。",
        content: "《周易》包含六十四卦，常用阴阳爻组成卦象。初学时可以先认识卦名、卦象和卦辞，再逐步了解爻辞。学习时建议把它当作传统文化材料，结合上下文阅读，不要只记单句。",
        tags: ["入门", "基础"],
    },
    {
        title: "认识八卦",
        category: "入门基础",
        summary: "先记住八卦名称，再观察卦象由什么组成。",
        content: "八卦是乾、坤、震、巽、坎、离、艮、兑。每个卦由三条阴爻或阳爻组成。学习时可以先认名称和符号，再练习把两个经卦组合成一个六爻卦。",
        tags: ["八卦", "卦象"],
    },
    {
        title: "怎样开始读一卦",
        category: "学习方法",
        summary: "从卦名、上下卦、卦辞和爻辞开始阅读。",
        content: "读一卦时可以按顺序看卦名、上下卦、卦辞和六条爻辞。先读完整段落，留意同一卦中各部分的关系，再用自己的话写下理解。遇到不熟悉的字词，先查注释，不要只凭一句话下结论。",
        tags: ["学习方法", "卦辞", "爻辞"],
    },
];

async function seedArticles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        for (const article of articles) {
            await Article.updateOne(
                { title: article.title },
                { $set: article },
                { upsert: true },
            );
        }

        console.log("已准备 3 篇入门文章。");
    } catch (error) {
        console.error("文章数据准备失败：", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

seedArticles();

require("dotenv").config();

const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");

const quiz = {
    category_title: "周易入门小测验",
    category_description: "用五道选择题复习六十四卦和八卦基础。",
    questions: [
        {
            question_text: "《周易》共有多少卦？",
            options: [
                { option_text: "六十四卦", is_correct: true },
                { option_text: "八卦", is_correct: false },
                { option_text: "三十六卦", is_correct: false },
            ],
        },
        {
            question_text: "一个经卦由几条爻组成？",
            options: [
                { option_text: "三条", is_correct: true },
                { option_text: "六条", is_correct: false },
                { option_text: "九条", is_correct: false },
            ],
        },
        {
            question_text: "六十四卦中的每一卦通常由几条爻组成？",
            options: [
                { option_text: "六条", is_correct: true },
                { option_text: "三条", is_correct: false },
                { option_text: "八条", is_correct: false },
            ],
        },
        {
            question_text: "八卦中代表天的是哪一卦？",
            options: [
                { option_text: "乾", is_correct: true },
                { option_text: "坤", is_correct: false },
                { option_text: "坎", is_correct: false },
            ],
        },
        {
            question_text: "八卦中代表地的是哪一卦？",
            options: [
                { option_text: "坤", is_correct: true },
                { option_text: "乾", is_correct: false },
                { option_text: "离", is_correct: false },
            ],
        },
    ],
};

async function seedQuiz() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Quiz.updateOne(
            { category_title: quiz.category_title },
            { $set: quiz },
            { upsert: true },
        );
        console.log("已准备周易入门小测验。");
    } catch (error) {
        console.error("测验数据准备失败：", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

seedQuiz();

require("dotenv").config();
const mongoose = require("mongoose");
const Hexagram = require("./models/Hexagram");

const names = [
    "乾为天",
    "坤为地",
    "水雷屯",
    "山水蒙",
    "水天需",
    "天水讼",
    "地水师",
    "水地比",
    "风天小畜",
    "天泽履",
    "地天泰",
    "天地否",
    "天火同人",
    "火天大有",
    "地山谦",
    "雷地豫",
    "泽雷随",
    "山风蛊",
    "地泽临",
    "风地观",
    "火雷噬嗑",
    "山火贲",
    "山地剥",
    "地雷复",
    "天雷无妄",
    "山天大畜",
    "山雷颐",
    "泽风大过",
    "坎为水",
    "离为火",
    "泽山咸",
    "雷风恒",
    "天山遁",
    "雷天大壮",
    "火地晋",
    "地火明夷",
    "风火家人",
    "火泽睽",
    "水山蹇",
    "雷水解",
    "山泽损",
    "风雷益",
    "泽天夬",
    "天风姤",
    "泽地萃",
    "地风升",
    "泽水困",
    "水风井",
    "泽火革",
    "火风鼎",
    "震为雷",
    "艮为山",
    "风山渐",
    "雷泽归妹",
    "雷火丰",
    "火山旅",
    "巽为风",
    "兑为泽",
    "风水涣",
    "水泽节",
    "风泽中孚",
    "雷山小过",
    "水火既济",
    "火水未济",
];

async function seedHexagrams() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const rows = names.map((name, index) => ({
            updateOne: {
                filter: { name },
                update: {
                    $setOnInsert: {
                        number: index + 1,
                        name,
                        symbol: String.fromCodePoint(0x4dc0 + index),
                        upperTrigram: "",
                        lowerTrigram: "",
                        category: "",
                        guaText: "",
                        lineTexts: ["", "", "", "", "", ""],
                        modernMeaning: "",
                        description: "请在管理页面补充卦辞和现代解读",
                    },
                },
                upsert: true,
            },
        }));
        await Hexagram.bulkWrite(rows);
        console.log("64 个卦象条目已准备好，请继续补充卦辞、爻辞和解读。");
    } catch (error) {
        console.error("卦象数据准备失败：", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedHexagrams();

const mongoose = require("mongoose");
const Hexagram = require("./models/hexagram"); // 注意与实际文件名大小写保持一致

// 数据库连接字符串（根据实际情况修改数据库名）
const MONGO_URI = "mongodb://localhost:27017/zhouyi_db";

const hexagramsData = [
  {
    name: "乾为天",
    symbol: "䷀",
    description: "乾：元，亨，利，贞。天行健，君子以自强不息。"
  },
  {
    name: "坤为地",
    symbol: "䷁",
    description: "坤：元亨，利牝马之贞。地势坤，君子以厚德载物。"
  },
  {
    name: "水雷屯",
    symbol: "䷂",
    description: "屯：元，亨，利，贞。勿用，有攸往，利建侯。"
  },
  {
    name: "山水蒙",
    symbol: "䷃",
    description: "蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。"
  }
  // 按照此格式补全其余卦象
];

async function seedData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("数据库连接成功");

    // 清空现有数据（防止重复植入）
    await Hexagram.deleteMany({});

    // 批量插入
    await Hexagram.insertMany(hexagramsData);
    console.log("64卦基础数据植入成功！");

    process.exit(0);
  } catch (error) {
    console.error("植入数据失败：", error);
    process.exit(1);
  }
}

seedData();
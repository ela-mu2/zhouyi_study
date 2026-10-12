const mongoose = require("mongoose");
const hexagramSchema = new mongoose.Schema({
  number: { type: Number, min: 1, max: 64, unique: true },
  name: { type: String, required: true, trim: true },
  symbol: { type: String, required: true },
  upperTrigram: { type: String, default: "" },
  lowerTrigram: { type: String, default: "" },
  category: { type: String, default: "" },
  guaText: { type: String, default: "" },
  lineTexts: { type: [String], default: [] },
  modernMeaning: { type: String, default: "" },
  description: { type: String, default: "" },
}, { timestamps: true });
module.exports = mongoose.model("Hexagram", hexagramSchema);

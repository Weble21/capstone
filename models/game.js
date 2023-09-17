const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  sport: {
    type: String,
    enum: ["baseball", "basketball", "soccer", "futsal"],
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    enum: ["amateur", "pro", "elite", "beginner"],
    required: true,
  },
  application: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
    require: true,
  },
  fair_tier: {
    type: Number,
    default: 1,
    min: 1,
    max: 6,
    required: true,
  },
  submittedNum: {
    type: [{ username: String, phone_num: String, fair_tier: Number }],
    default: [],
  },
});
productSchema.pre("save", function (next) {
  if (this.time && typeof this.time === "string") {
    this.time = new Date(this.time);
  }
  next();
});

// 날짜 필드를 원하는 형식으로 가상 필드로 정의
productSchema.virtual("formattedDay").get(function () {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  };
  return this.time.toLocaleDateString("ko-KR", options);
});
// 날짜 필드를 원하는 형식으로 가상 필드로 정의
productSchema.virtual("formattedTime").get(function () {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    //timeZoneName: "short",
    hour12: false,
  };
  return this.time.toLocaleTimeString("ko-KR", options);
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

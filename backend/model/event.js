const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên sự kiện"],
  },
  description: {
    type: String,
    required: [true, "Vui lòng nhập mô tả sự kiện"],
  },
  category: {
    type: String,
    required: [true, "Vui lòng nhập chọn sự kiện"],
  },
  start_Date: {
    type: Date,
    required: true,
  },
  Finish_Date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Running",
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Vui lòng nhập giá khuyến mãi sự kiện"],
  },
  stock: {
    type: Number,
    required: [true, "Vui lòng nhập số lượng sự kiện tồn kho"],
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Event", eventSchema);

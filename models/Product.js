const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "請輸入 產品名稱"],
    },
    comment: {
      type: String,
      required: [true, "請輸入 產品描述"],
    },
    category: {
      type: String,
      enum: ["cake", "meal", "drink", "coffee"],
      required: [true, "請輸入 產品分類"],
    },
    image: {
      type: String,
    },
    images: {
      type: Array, //[String]
    },
    is_enable: {
      type: Boolean,
      default: false,
    },
    createTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // 清除使用 toJSON 產生多餘的 id 屬性
    id: false,
  }
);

// 虛擬屬性
// 平常不顯示需 populate options 才會顯示
ProductSchema.virtual("options", {
  ref: "option",
  // 用 post model 的 _id 去查找 comment model 的 post
  localField: "_id",
  foreignField: "productId",
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    isPaid: {
      type: Boolean,
      default: false,
    },
    mealStatus: {
      type: Number,
      default: 25,
    },
    payMethod: {
      type: String,
      enum: ["shoppingOptions.paymethods.cash", "shoppingOptions.paymethods.linePay", "shoppingOptions.paymethods.catPay"],
    },
    total: {
      type: Number,
      require: [true, "請輸入 總金額"],
    },
    productList: [
      {
        flavor: {
          type: String,
          require: [true, "請輸入 商品 name"],
        },
        type: {
          type: String,
          require: [true, "請輸入 商品 type"],
        },
        size: {
          type: String,
          require: [true, "請輸入 商品 size"],
        },
        ice: {
          type: Number,
          default: 0,
        },
        sugar: {
          type: Number,
          default: 0,
        },
        qty: {
          type: Number,
          require: [true, "請輸入 商品 qty"],
        },
        price: {
          type: Number,
          require: [true, "請輸入 商品 price"],
        },
        isDelivered: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createTime: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;

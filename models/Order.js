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
    amount: {
      type: Number,
      require: [true, "請輸入 總金額"],
    },
    transactionId: {
      type: Number,
    },
    productList: [
      {
        name: {
          type: String,
          require: [true, "請輸入 商品 name"],
        },
        flavor: {
          type: String,
          require: [true, "請輸入 商品 flavor"],
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
        quantity: {
          type: Number,
          require: [true, "請輸入 商品 quantity"],
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
    cookieId: {
      type: Number,
      default: Date.now,
    },
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

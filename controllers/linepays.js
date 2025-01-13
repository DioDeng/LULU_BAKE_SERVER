const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Order = require("../models/Order");

const { HmacSHA256 } = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const axios = require("axios");

require("dotenv").config();
const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_VERSION,
  LINEPAY_SITE,
  LINEPAY_CHANNEL_SECRET_KEY,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL,
} = process.env;

// 製作headers簽章
function createSignature(uri, linePayBody) {
  const nonce = parseInt(new Date().getTime() / 1000);
  const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(
    linePayBody
  )}${nonce}`;

  const signture = Base64.stringify(
    HmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY)
  );

  // 準備post 給 line pay 的資訊
  const headers = {
    "X-LINE-ChannelId": LINEPAY_CHANNEL_ID,
    "Content-Type": "application/json",
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signture,
  };

  return headers;
}

const linepays = {
  // 取得單一訂單
  async confirmOrder(req, res, next) {
    const { transactionId, orderId } = req.query;

    const isOrderExist = await Order.findById(orderId).exec();

    if (!isOrderExist) {
      return next(appError(400, "取得失敗，查無此 訂單", next));
    }

    // 將訂單paid修改成true
    // 寫回資料庫
    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        mealStatus: 50,
        transactionId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    const linePayBody = {
      amount: isOrderExist.amount,
      currency: "TWD",
    };
    const uri = `/payments/${transactionId}/confirm`;

    const headers = createSignature(uri, linePayBody);

    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    const linePayRes = await axios.post(url, linePayBody, { headers });

    // 重新導向前端連結，讓前端重新戳api得到已付款資訊
    res.redirect(`http://localhost:8080/#/order/${isOrderExist.cookieId}`);
  },
  // 建立訂單
  async createLinepay(req, res, next) {
    const { orderId } = req.params;
    const isOrderExist = await Order.findById(orderId).exec();

    if (!isOrderExist) {
      return next(appError(400, "取得失敗，查無此 訂單", next));
    }
    if (isOrderExist.payMethod !== "shoppingOptions.paymethods.linePay") {
      return next(appError(400, "付款方式有誤", next));
    }

    const order = {
      orderId,
      amount: isOrderExist.amount,
      currency: "TWD",
      packages: [
        {
          id: orderId, //訂單id
          amount: isOrderExist.amount,
          products: isOrderExist.productList,
        },
      ],
    };

    const linePayBody = {
      ...order,
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}/${LINEPAY_RETURN_CONFIRM_URL}`,
        cancelUrl: `${LINEPAY_RETURN_HOST}/${LINEPAY_RETURN_CANCEL_URL}`,
      },
    };

    const uri = "/payments/request";

    const headers = createSignature(uri, linePayBody);

    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    const linePayRes = await axios.post(url, linePayBody, { headers });
    console.log(linePayRes.data.info.paymentUrl);
    if (linePayRes?.data?.returnCode === "0000") {
      resSuccess(res, 200, linePayRes.data.info.paymentUrl);
    }
  },
  // 退款admin
  async refundLinepay(req, res, next) {
    console.log(123)
  }
};

module.exports = linepays;

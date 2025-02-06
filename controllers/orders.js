const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Order = require("../models/Order");

const orders = {
  // 取得所有訂單
  async getOrders(req, res, next) {
    // 排序
    const sort = req.query.sort == "asc" ? "createTime" : "-createTime";
    // 關鍵字搜尋
    const keyword =
      req.query.keyword !== undefined
        ? { category: new RegExp(req.query.keyword) }
        : {};
    if (!req.user) {
      return next(appError(400, "取得失敗，權限有問題", next));
    }
    const orders = await Order.find(keyword).sort(sort);

    resSuccess(res, 200, orders);
  },
  // 取得單一訂單
  async getOrder(req, res, next) {
    const { orderId } = req.params;
    console.log(orderId);
    const orderInfo = await Order.findById(orderId);

    if (!orderInfo) {
      return next(appError(400, "取得失敗，查無此 訂單", next));
    }

    resSuccess(res, 200, orderInfo);
  },
  // 建立訂單
  async createOrder(req, res, next) {
    const { productList, payMethod, mealStatus } = req.body;
    if (productList.length === 0) {
      return next(appError(400, "購物車無商品！", next));
    }
    let amount = 0;
    productList.forEach((item) => {
      amount += item.price * item.quantity;
    });
    const newOrder = await Order.create({
      payMethod,
      mealStatus,
      productList,
      amount,
    });
    resSuccess(res, 200, newOrder);
  },
  // 刪除一筆訂單
  async deleteOrder(req, res, next) {
    const { orderId } = req.params;

    // 驗證order是否存在
    const isExist = await Order.findById(orderId).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此order", next));
    }

    // 檢查mealStatus 是否在 25 (出餐中、完成無法刪除訂單)
    if(isExist.mealStatus !== 25) {
      return next(appError(400, "刪除失敗，訂單已完成或出餐中", next));
    }

    const delOrder = await Order.findByIdAndDelete(orderId, {
      new: true,
    });

    resSuccess(res, 200, delOrder);
  },
  // 更新訂單
  async updateOrder(req, res, next) {
    const { orderId } = req.params;
    const { mealStatus } = req.body;

    if (!mealStatus) {
      return next(appError(400, "欄位未填寫正確", next));
    }

    const isExist = await Order.findById(orderId).exec();

    if (!isExist) {
      return next(appError(400, "修改失敗，查無此訂單", next));
    }

    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        mealStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    resSuccess(res, 200, updateOrder);
  },
};

module.exports = orders;

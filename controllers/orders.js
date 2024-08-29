const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Order = require("../models/Order");

const orders= {
    // 取得單一訂單
    async getOrder(req, res, next) {
        const { orderId } = req.params;

        const orderInfo = await Order.findById(orderId)

        if(!orderInfo) {
            return next(appError(400, "取得失敗，查無此 訂單", next));
        }

        resSuccess(res, 200, orderInfo);
    },
    // 建立訂單
    async createOrder(req, res, next) {
        const {productList, payMethod, mealStatus} = req.body;
        if(productList.length === 0) {
            return next(appError(400, "購物車無商品！", next));
        }

        const newOrder = await Order.create(
            {
                payMethod,
                mealStatus,
                productList
            }
        );

        resSuccess(res, 200, newOrder);
    },
    // 刪除一筆訂單
    async deleteOrder(req, res, next) {
        const { orderId } = req.params;

         // 驗證order是否存在
         const isExist = await Order.findById(orderId).exec();
         if(!isExist) {
             return next(appError(400, "刪除失敗，查無此order", next));
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
        console.log(orderId, mealStatus)
        if(!mealStatus) {
            return next(appError(400, "欄位未填寫正確", next));
        }

        const isExist = await Order.findById(orderId).exec();

        if(!isExist) {
            return next(appError(400, "修改失敗，查無此訂單", next));
        }

        const updateOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                mealStatus
            },
            {
                new: true,
                runValidators: true,
            }
            );

            resSuccess(res, 200, updateOrder);
    }
}

module.exports = orders;
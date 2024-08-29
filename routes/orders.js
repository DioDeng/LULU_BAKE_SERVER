var express = require("express");
var router = express.Router();
const OrderControllers = require("../controllers/orders");
const handErrorAsync = require("../service/handErrorAsync");
// const { isAdmin } = require("../middleware/auth");

router.get("/order/:orderId", handErrorAsync(OrderControllers.getOrder));
router.post("/order", handErrorAsync(OrderControllers.createOrder));
router.patch("/order/:orderId", handErrorAsync(OrderControllers.updateOrder));
router.delete("/order/:orderId", handErrorAsync(OrderControllers.deleteOrder));



module.exports = router;
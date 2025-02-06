const express = require("express");
const router = express.Router();
const OrderControllers = require("../controllers/orders");
const LinepayContrillers = require('../controllers/linepays');
const handErrorAsync = require("../service/handErrorAsync");
const { isAdmin } = require("../middleware/auth");

router.get("/orders", isAdmin, handErrorAsync(OrderControllers.getOrders));
router.patch("/order/:orderId", isAdmin, handErrorAsync(OrderControllers.updateOrder));

router.get("/order/:orderId", handErrorAsync(OrderControllers.getOrder));
router.post("/order", handErrorAsync(OrderControllers.createOrder));
router.patch("/order/:orderId", handErrorAsync(OrderControllers.updateOrder));
router.delete("/order/:orderId", handErrorAsync(OrderControllers.deleteOrder));

// linepays
router.post("/linepay/:orderId", handErrorAsync(LinepayContrillers.createLinepay));
router.get("/linepay/confirm", handErrorAsync(LinepayContrillers.confirmOrder));
router.post("linepay/refund/:orderId", )

// paypals




module.exports = router;
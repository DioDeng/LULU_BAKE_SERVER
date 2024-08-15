var express = require("express");
var router = express.Router();
const ProductControllers = require("../controllers/products");
const handErrorAsync = require("../service/handErrorAsync");
// const { isAdmin } = require("../middleware/auth");

// admin
// router.get("/admin/products", isAdmin, handErrorAsync(ProductControllers.getProducts));
// router.post("/admin/product", isAdmin, handErrorAsync(ProductControllers.createProduct));
// router.patch("/admin/product/:productId", isAdmin, handErrorAsync(ProductControllers.updateProduct));
// router.delete("/admin/product/:productId", isAdmin, handErrorAsync(ProductControllers.deleteProduct));


router.get("/products", handErrorAsync(ProductControllers.getProducts));
router.get("/product/:productId", handErrorAsync(ProductControllers.getProduct));
router.post("/product", handErrorAsync(ProductControllers.createProduct));
router.patch("/product/:productId", handErrorAsync(ProductControllers.updateProduct));
router.delete("/product/:productId", handErrorAsync(ProductControllers.deleteProduct))

module.exports = router;
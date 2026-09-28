const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const auth = require("../middlewares/auth");

router.use(express.json());

router.get("/", auth.authenticate, productController.getAllProducts);

router.get("/:id", auth.authenticate, productController.getProductById);

router.post("/", auth.authenticate, productController.addNewProduct);

router.patch("/:id", auth.authenticate, productController.updateProduct);

router.delete("/:id", auth.authenticate, productController.deleteProduct);

module.exports = router;

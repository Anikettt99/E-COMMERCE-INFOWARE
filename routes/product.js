const express = require("express");

const productController = require("../controller/productController");
const multer = require("multer");

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage: storage }).single("image");

const router = express.Router();

router.post("/add-product", multer().none(), productController.add_product);

router.get("/get-products", productController.get_products);

router.get("/:id", productController.get_product);

router.put("/:id", upload, productController.update_product);

module.exports = router;

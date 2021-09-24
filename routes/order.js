const express = require("express");

const orderController = require("../controller/orderController");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/order-items" , upload.none() , orderController.order_item);

router.get("/get-orders" , orderController.get_orders);

router.get("/get-all-orders" , orderController.get_all_orders);

module.exports = router;
const express = require("express");

const userController = require("../controller/userController");

const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/signUp", upload.none(), userController.add_account);
router.post("/logIn", upload.none(), userController.login);
router.get("/:id", userController.get_user);

module.exports = router;

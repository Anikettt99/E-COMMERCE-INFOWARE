const express = require('express');

const ownerController = require('../controller/ownerController');
const multer = require('multer');
const upload=multer();

const router = express.Router();


router.post('/add-account' , upload.none() , ownerController.add_account);

router.post('/logIn' , upload.none() , ownerController.login);

module.exports = router;
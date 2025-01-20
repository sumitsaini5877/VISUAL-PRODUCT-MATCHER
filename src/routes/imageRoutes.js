const express = require("express");
const router = express.Router();
const { searchImage, showImages } = require("../controllers/imageController");
const multer = require('multer');

// Set up multer for file upload (CSV)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get("/", showImages);
router.post('/upload', upload.single('image'), searchImage);


module.exports = router;

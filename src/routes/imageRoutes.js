const express = require("express");
const router = express.Router();
const { searchImage, showImages } = require("../controllers/imageController");
const multer = require('multer');

// Set up multer for file upload (CSV)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), searchImage);
router.get("/", showImages);

module.exports = router;

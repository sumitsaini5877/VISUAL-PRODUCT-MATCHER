const express = require('express');
const router = express.Router();
const { getAllProducts, uploadCSV } = require('../controllers/productController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Set up multer for file upload (CSV)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/data';
        // Ensure the directory exists
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with unique name
    }
});



const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    }
});

router.get('/', getAllProducts); // Default page for product listing
router.post('/upload', upload.single('csvFile'), uploadCSV); // Route for CSV upload

module.exports = router;

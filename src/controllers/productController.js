const Product = require('../models/product');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { bulkCreateProducts, getPaginatedProducts } = require("../services/productService");
const { processAndSaveProductData } = require("../services/gcpService");

// src/controllers/productController.js
exports.getAllProducts =  async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    try {
        const result = await getPaginatedProducts(Number(page), Number(limit));
        //console.log(result.products);
        res.render('index', {
            products: result.products,
            totalPages: result.totalPages, // Pass totalPages to the view
            currentPage: result.currentPage,
            limit: Number(limit), // Pass limit for pagination links
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};


// Handle CSV file upload to seed products
exports.uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

      
    
        // Path to the file that was uploaded to disk
        const csvFile = req.file.path;
    
        const results = [];
    
        // Open a read stream to the uploaded file
        fs.createReadStream(csvFile)
            .pipe(csv()) // Parse the CSV file
            .on('data', (data) => {
                // Process each record here. For example, you can add the records to an array:
                results.push(data);
            })
            .on('end', () => {
                // After all records are processed, you can handle the results
                console.log('CSV Data:', results);
                processAndSaveProductData(results);
                // You can save the data to your database or perform other processing
                // For now, we'll just send it back in the response as an example
                res.send('CSV uploaded and processed successfully');
            })
            .on('error', (err) => {
                console.error('Error processing CSV:', err);
                res.status(500).send('Error processing CSV file');
            });
    } catch (error) {
        console.error('Error uploading CSV:', error);
        res.status(500).send('Error uploading CSV');
    }
};

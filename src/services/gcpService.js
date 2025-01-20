const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const mongoose = require('mongoose');
const Product = require('../models/product'); // Assuming you have a Product model
const { features } = require('process');
const { log } = require('console');

// Initialize Google Vision API client
const client = new ImageAnnotatorClient();
// Set the credentials path
process.env.GOOGLE_APPLICATION_CREDENTIALS = './credentials.json';

async function processAndSaveProductData(products) {
    const directory = './public/sample/';

    // Ensure the directory exists
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    $i = 0;
    for (const product of products) {
        $i++;
        const { ImageURL, Name, Description, Category } = product; // Assuming these fields in the product record
        const imageUrlWithBasePath = 'https://visual-product-matcher-gcol.onrender.com' + ImageURL;
        console.log(imageUrlWithBasePath);
        // 1. Download image from URL
        const imagePath = await downloadImage(imageUrlWithBasePath, Name);

        // 2. Analyze the image using Google Vision API
        const features = await analyzeImage(imagePath);
        console.log("features are: ", features);
        console.log(imagePath)
        // 3. Save the image metadata and features in MongoDB
        await saveImageMetaToDB(
            Name,
            Category,
            imagePath,
            Description,
            features
        );
        
        // Stop the loop when i equals 5
        if ($i === 1) {
            console.log('Loop stopped at 1');
            break;  // This will stop the loop execution
        }
    }
}

// Download image from URL
async function downloadImage(url, productName) {
    try {
        const filePath = path.join('./public/sample', `${productName}-${Date.now()}.jpg`);
        const writer = fs.createWriteStream(filePath);

        // Download the image
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        // Pipe the image to the file system
        response.data.pipe(writer);

        // Wait for the download to complete
        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error('Error downloading image:', error);
        throw new Error('Error downloading image');
    }
}

async function findSimilarImages(image) {
    // console.log("image is ",image);
    
    uploadedFeatures = await analyzeImage(image);
    console.log("uploadedFratures in gcp:",uploadedFeatures);
    
    // const secondProduct = await Product.findOne().skip(1).lean();

    // if (!secondProduct) {
    //   console.log("No second product found in the database.");
    //   return;
    // }
    
    // uploadedFeatures = secondProduct.features; 

    // Fetch all products from the database (or use a more optimized query in production)
    const allProducts = await Product.find();

    // Basic similarity check - match on feature names and score (this can be extended)
    return allProducts.filter(product => {
      const dbFeatures = product.features; // assuming image features are stored in database

      // Compare uploaded features with database features
      const similarity = dbFeatures.filter(dbFeature =>
        uploadedFeatures.some(uploadedFeature =>
          uploadedFeature.name === dbFeature.name &&
          Math.abs(uploadedFeature.score - dbFeature.score) < 0.1 // Adjust the threshold as needed
        )
      );

      return similarity.length > 0; // If there is a match, consider it similar
    });
}

// Analyze image using Google Vision API
async function analyzeImage(imagePath) {

   
    
    try {
        const [result] = await client.objectLocalization(imagePath);
        const objects = result.localizedObjectAnnotations;
        
        // Extract and structure the features (name, score, boundingPoly)
        const imageFeatures = objects.map(object => ({
            name: object.name,          // Object name
            score: object.score,        // Confidence score
            boundingPoly: object.boundingPoly,  // Bounding polygon (for localization)
        }));
        console.log("features", imageFeatures);
        return imageFeatures;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw new Error('Error analyzing image');
    }
}

// Save image metadata and features in MongoDB
async function saveImageMetaToDB(name, category, path, description, features) {
    try {
        const product = new Product({
            name,
            category,
            path,
            description,
            features,
        });

        await product.save();
        console.log('Product saved successfully');
    } catch (error) {
        console.error('Error saving product data:', error);
    }
}

module.exports = {
    processAndSaveProductData,
    findSimilarImages
};

const fs = require("fs");
const path = require("path");
const { findSimilarImages } = require("../services/gcpService");
const { saveImageData, getAllImages } = require("../services/productService");
const { features } = require("process");
const sharp = require("sharp");
const cloudinary = require('../config/cloudinaryConfig');

async function searchImage(req, res) {
  try {
     
     if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    imageUrl=req.body;
    imageBuffer=req.file.buffer;
   
    if(imageBuffer){

    const result = await new Promise((resolve,reject)=>{
      cloudinary.uploader.upload_stream(
        {
          folder: 'user_uploads', // Replace 'user_uploads' with your desired folder name
          upload_preset: 'visual-images',
        },(error,result)=>{
          if(error) return reject(error);
          resolve(result);

        }
      ).end(imageBuffer);
    })
    
      console.log(result.url);
      
    similarImages = await findSimilarImages(result.url);
  }


  if(imageUrl){
    console.log(imageUrl);
    
    similarImages = await findSimilarImages(imageUrl);
  }
    
    // Step 5: Return the analysis result and any similar images
    res.json({
      'similar_images': similarImages,
      message:'image upload '
    });

  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function showImages(req, res) {
  const similarProducts = await getAllImages(); // Or your logic to fetch similar products
  res.render('similar', { similarProducts });
}

module.exports = { searchImage, showImages };

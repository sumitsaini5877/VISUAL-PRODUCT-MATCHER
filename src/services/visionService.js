const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });

async function analyzeImage(imagePath) {
console.log("imagePath in vision",imagePath);

  try {
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    return labels;
  } catch (error) {
    console.error("Error during Vision API call:", error);
    throw new Error("Error analyzing image with Vision API");
  }
}

module.exports = { analyzeImage };

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

async function analyzeImage(imagePath) {
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

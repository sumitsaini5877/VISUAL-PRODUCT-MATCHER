const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for Image Features based on Google Vision API response
const imageFeatureSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., 'label', 'text', etc.
  score: { type: Number, required: true }, // Confidence score for the feature detection
  boundingPoly: {
      vertices: [{ x: Number, y: Number }],
      normalizedVertices: [{ x: Number, y: Number }],
  },
});

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  path: { type: String, required: true },
  description: { type: String, required: true },
  features:[imageFeatureSchema],
  dateUploaded: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;


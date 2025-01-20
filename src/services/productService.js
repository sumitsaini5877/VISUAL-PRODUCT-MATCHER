const Product = require("../models/product");

// Get products with pagination
async function getPaginatedProducts(page, limit) {  
  const skip = (page - 1) * limit;
    try {
        const products = await Product.find()
            .skip(skip)
            .limit(limit)
            .exec();

        // Get the total count for pagination
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            products,
            totalPages,
            currentPage: page,
            totalProducts,
        };
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
}

async function bulkCreateProducts(products) {
  try {
      const productDocs = products.map(product => ({
          name: product.name,
          category: product.category,
          price: product.price,
          img: product.img,
          description: product.description
      }));
      await Product.insertMany(productDocs);
  } catch (error) {
      console.error('Error seeding products:', error);
      throw new Error('Error seeding products');
  }
}

async function saveImageData(imageData, metadata) {
  const newProduct = new Product({
    imageName: imageData.name,
    imageUrl: `/images/${imageData.name}`,
    metadata: metadata
  });

  await newProduct.save();
  return newProduct;
}

async function getAllImages() {
  return await Product.find();
}

module.exports = { saveImageData, getAllImages, getPaginatedProducts, bulkCreateProducts};

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const path = require("path");

const imageRoutes = require('./routes/imageRoutes'); // Make sure the path is correct
const productRoutes = require('./routes/productRoutes'); // Same for productRoutes
const expressLayouts = require('express-ejs-layouts');
const connection = require('./db/connection');
// require('./utils/deleteOldImages');


const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = process.env.MONGODB_URI;

// MongoDB connection
connection(mongoURI);

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });
// Routes

app.use("/image", imageRoutes);
app.use("/products", productRoutes);

// View engine setup
app.set("view engine", "ejs");
app.set('views', path.join(__dirname,  'views'));


// Serve static files from the 'public' folder located at the root level
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const mongoose = require('mongoose');

const connection =(url)=>{
mongoose.connect(url).then(() => {
    console.log("MongoDB connected");
  }).catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

}

module.exports = connection;
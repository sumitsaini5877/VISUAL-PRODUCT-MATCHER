const cloudinary = require("../config/cloudinaryConfig");
const cron = require("node-cron");

// Set the time duration for deletion (e.g., 1 minute)
const deletionDuration = 1 * 60 * 1000; // 1 minute in milliseconds

// Schedule a task to run every minute
cron.schedule("*/1 * * * *", async () => {
  console.log("Running scheduled task to delete old images...");
  try {
    // Fetch the list of uploaded resources
    const result = await cloudinary.api.resources({
      type: "upload", // Resource type
      prefix:"user_uploads",
      max_results: 10 // Maximum number of results to fetch

    });
   
    
    const now = Date.now(); // Current time in milliseconds

    // Iterate over resources and delete old images
    result.resources.forEach((image) => {
      const uploadAge = now - new Date(image.created_at).getTime(); // Age of the image in milliseconds
    //   console.log('Deleting image with public_id:', image.public_id);
      if (uploadAge > deletionDuration) {
        // Delete the image if it exceeds the deletion duration
        
        cloudinary.uploader.destroy(
          image.public_id,
          { invalidate: true },
          (err, res) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log(`Deleted image: ${image.public_id}`);
            }
          }
        );
      }
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
  }
});

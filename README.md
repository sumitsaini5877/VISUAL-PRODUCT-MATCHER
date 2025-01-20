Overview

The Visual Product Matcher is a web application that helps users find visually similar
products based on uploaded images. It leverages Google Cloud Vision API for analyzing
image content and comparing it with a product database to find similar items. 
The app allows users to upload an image via file upload or URL input, view the 
uploaded image, and see a list of similar products with filters for similarity score.

Setup Steps
Clone the repository:

Step 1:
git clone https://github.com/your-repo/visual-product-matcher.git
cd visual-product-matcher

Step 2:
npm install
Set up Google Cloud Vision API credentials:

Step 3:
Create a Google Cloud Project and enable the Cloud Vision API.
Download the credentials JSON file and set the following environment variable:

GOOGLE_APPLICATION_CREDENTIALS=path_to_your_credentials.json
Run the app locally:

Step 4:
npm start
The app will be running on http://localhost:5000

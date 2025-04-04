// backend/plateDetection.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const ML_API_URL = 'http://127.0.0.1:5000/detect'; // URL of your ML model endpoint

// Function to send image to the ML model API and receive the detected plate text
const detectPlate = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(ML_API_URL, formData, {
      headers: formData.getHeaders(),
    });

    return response.data; // Returns the ML model output (plate number)
  } catch (error) {
    console.error('Error in detecting plate:', error);
    throw new Error('Error detecting plate');
  }
};

module.exports = { detectPlate };

// backend/routes/plateRoutes.js
const express = require('express');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const { detectPlate } = require('../plateDetection'); // Import plate detection logic
const Plate = require('../model/plate'); // Import the MongoDB model

const router = express.Router();

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Route for detecting plates
router.post('/detect-plate', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = path.join(__dirname, '..', req.file.path);

    // Call the plate detection model to get the result
    const result = await detectPlate(imagePath);

    if (result && result.plate_number) {
      return res.json({ plate_number: result.plate_number });
    } else {
      return res.status(400).json({ error: 'No plate detected' });
    }
  } catch (error) {
    console.error('Error in detecting plate:', error);
    res.status(500).json({ error: 'Error detecting plate' });
  }
});

// Route for saving plate number to MongoDB
router.post('/save-plate', async (req, res) => {
  try {
    const { plate_number } = req.body;
    if (!plate_number) {
      return res.status(400).json({ error: 'Plate number is required' });
    }

    // Save the plate number to MongoDB
    const plate = new Plate({ plate_number });
    await plate.save();

    return res.json({ message: 'Plate number saved successfully' });
  } catch (error) {
    console.error('Error saving plate number:', error);
    res.status(500).json({ error: 'Error saving plate number' });
  }
});

module.exports = router;

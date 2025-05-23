// backend/routes/plateRoutes.js
const express = require('express');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const { detectPlate } = require('../plateDetection'); // Import plate detection logic
const Plate = require('../model/plate'); // Import the MongoDB model
const QRCode = require('qrcode');
const fs = require('fs');
const PDFDocument = require('pdfkit');
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
    const { plateNumber } = req.body;
    if (!plateNumber) {
      return res.status(400).json({ error: 'Plate number is required' });
    }

    // Save the plate number to MongoDB
    const plate = new Plate({ plateNumber });
    await plate.save();

    return res.json({ message: 'Plate number saved successfully' });
  } catch (error) {
    console.error('Error saving plate number:', error);
    res.status(500).json({ error: 'Error saving plate number' });
  }
});

router.post('/generate-qrcode', async (req, res) => {

  const { plate_number , driver_name, vehicle_type } = req.body;
  try {
    const qrData =  { plate_number , driver_name, vehicle_type };
    const qrCodeData = await QRCode.toDataURL(JSON.stringify(qrData));

    // Create a new PDF document
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=car_parking_qr.pdf');
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add text to the PDF
    doc.fontSize(25).text('Car Parking System QR Code', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Plate Number: ${plate_number}`);
    doc.text(`Driver Name: ${driver_name}`);
    doc.text(`Vehicle Type: ${vehicle_type}`);

    // Add the QR code image to the PDF
    doc.image(qrCodeData, { fit: [150, 150], align: 'center', valign: 'center' });

    // Finalize the PDF and end the stream
    doc.end();

  } catch (error) {
    console.error('Error generating QR code and PDF:', error);
    res.status(500).json({ error: 'Error generating QR code and PDF' });
  }
})

module.exports = router;
